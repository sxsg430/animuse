var express = require('express');
var router = express.Router();
const Spotify = require('node-spotify-api');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  var spotify = new Spotify({
    id: process.env.SPOTIFY_CLIENT,
    secret: process.env.SPOTIFY_SECRET
  });
  let cleanupSongString = function(songStr) {
    // Messy function for performing various operations to convert the raw song and artist string from MAL to something usable by Spotify.
    // Decent chance of breaking if MAL changes how they present data.
    try {
      // Try splitting the song string, otherwise return an error.
      let reg = /^\d:\s/gi;
      let finalStr = songStr.split(' by ')[0].replace(reg, '').replace('\"', '').replace('\"', '').replace(')', '').split(' (');
      let artistStr = songStr.split(' by ')[1].replace(')', '').split(' (');
      let artistArr = songStr.split(' by ')[1].split(' (');
      // Iterate over full list of song names. If the string provided two artist names (one in Japanese), default to the Japanese one (works better with Spotify).
      let out = finalStr.map((songname) => {
      if (artistArr.length > 2) {
        return songname + " " + artistStr[1];
      } else {
        return songname + " " + artistStr[0];
      }});
      return out;
    ;
  } catch {
    return res.json("FAILED");
  }
  }

  // First pass search of Spotify using the first cleaned song title/artist.
  spotify.search({type: 'track', query: cleanupSongString(req.query.song)[0]})
  .then((data) => {
    if (data['tracks'].items.length > 0) {
      // If any match is found, return the first result's spotify URI.
      return res.json(data['tracks']['items'][0]['uri']);
    } else {
      // Otherwise, if there was a second cleaned title/artist, perform another search using it.
      if (cleanupSongString(req.query.song).length > 1) {
        spotify.search({type: 'track', query: cleanupSongString(req.query.song)[1]})
      .then((data) =>{
        if (data['tracks'].items.length > 0) {
          // If any match is found, return the first result's spotify URI. Otherwise, error.
          return res.json(data['tracks']['items'][0]['uri']);
        } else {
          return res.json("FAILED");
        }
      })
      } else {
        // Return error if the first search failed and no query to use with the second search.
        return res.json("FAILED");
      }
      
    }
  })
  .catch((err) => {
    return res.json("FAILED");
  })
});

module.exports = router;
