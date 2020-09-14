var express = require('express');
var router = express.Router();
const Spotify = require('node-spotify-api');

/* GET users listing. */
router.get('/', function(req, res, next) {
  var spotify = new Spotify({
    id: process.env.SPOTIFY_CLIENT,
    secret: process.env.SPOTIFY_SECRET
  });
  let cleanupSongString = function(songStr) {
    let reg = /^\d:\s/gi;
    let finalStr = songStr.split(' by ')[0].replace(reg, '').replace('\"', '').replace('\"', '').replace(')', '').split(' (');
    let artistStr = songStr.split(' by ')[1].replace(')', '').split(' (');
    //.replace('\"', '').replace('\"', '').replace(')', '').split('and').split(' (')[0];
    let artistArr = songStr.split(' by ')[1].split(' (');
    let out = finalStr.map((songname) => {
      if (artistArr.length > 2) {
        return songname + " " + artistStr[1];
      } else {
        return songname + " " + artistStr[0];
      }
      
    });
    console.log(out);
    return out;
  }
  spotify.search({type: 'track', query: cleanupSongString(req.query.song)[0]})
  .then((data) => {
    if (data['tracks'].items.length > 0) { // If array of tracks is length of 0, assume no matches and return error message.
      return res.json(data['tracks']['items'][0]['uri']);
    } else {
      return res.json("FAILED");
    }
  })
});

module.exports = router;
