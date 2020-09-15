var express = require('express');
var router = express.Router();
var Discojs = require('discojs');

/* GET users listing. */
router.get('/', function(req, res, next) {

  const discogs = new Discojs({
    userToken: process.env.DISCOGS_PERSONAL_TOKEN,
  });

  let cleanupSongString = function(songStr) {
    // Messy function for performing various operations to convert the raw song and artist string from MAL to something usable by Discogs.
    // Decent chance of breaking if MAL changes how they present data.
    let reg = /^\d:\s/gi;
    let finalStr = songStr.split(' by ')[0].replace(reg, '').replace('\"', '').replace('\"', '').replace(')', '').split(' (');
    let artistStr = songStr.split(' by ')[1].replace(')', '').split(' (');
    let artistArr = songStr.split(' by ')[1].split(' (');
    // Iterate over full list of song names. If the string provided two artist names (one in Japanese), default to the Japanese one (works better with Discogs).
    let out = finalStr.map((songname) => {
      if (artistArr.length > 2) {
        return [songname, artistStr[1]];
      } else {
        return [songname, artistStr[0]];
      }
      
    });
    return out;
  }
  // Create blank query strings to be filled later.
  let query = {};
  let queryNoArtist = {};
  try {
    // Run song string through the cleanup function. Return error ifs something fails.
    let stripInfo = cleanupSongString(req.query.song);
    // If returned array has more than one element, use the second one (likely to contain track and artist name in Japanese which can work better with Discogs)
    if (stripInfo.length > 1) {
      var songTitle = stripInfo[1][0];
      var songArtist = stripInfo[1][1];
    } else {
      var songTitle = stripInfo[0][0];
      var songArtist = stripInfo[0][1];
    }
    // Update queries to use new data. One omits the artist and release year (necessary to catch issues like the album being available in the year before/after the show or the artist name being in Japanese).
     query = {query: songTitle, artist: songArtist, type: 'release', country: 'Japan', year: req.query.year};
     queryNoArtist = {query: songTitle, type: 'release', country: 'Japan'};
  } catch {
    return res.json("ERROR");
  }
  

  // Run first pass search for Discogs. Returns error code if any error is encountered.
  // NOTE: Assumes all songs originated from Japan
  discogs.searchDatabase(query)
  .then((data) => {
    if (data.results.length > 0) {
      // If response has at least one result, return the first one.
      return res.json(data['results'][0])
    } else {
      // Otherwise perform a second search using the query without the artist.
      discogs.searchDatabase(queryNoArtist)
      .then((data) => {
        if (data.results.length > 0) {
          // If response has at least one result, return the first one. Otherwise, error.
          return res.json(data['results'][0])
        } else {
          return res.json("ERROR");
        }
      })
    }
  })
  .catch((err) => {
    return res.json("ERROR");
  })
});

module.exports = router;
