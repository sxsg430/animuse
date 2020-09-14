var express = require('express');
var router = express.Router();
var Discojs = require('discojs');

/* GET users listing. */
router.get('/', function(req, res, next) {

  const discogs = new Discojs({
    userToken: process.env.DISCOGS_PERSONAL_TOKEN,
  });

  let cleanupSongString = function(songStr) {
    let reg = /^\d:\s/gi;
    let finalStr = songStr.split(' by ')[0].replace(reg, '').replace('\"', '').replace('\"', '').replace(')', '').split(' (');
    let artistStr = songStr.split(' by ')[1].replace(')', '').split(' (');
    //.replace('\"', '').replace('\"', '').replace(')', '').split('and').split(' (')[0];
    let artistArr = songStr.split(' by ')[1].split(' (');
    let out = finalStr.map((songname) => {
      if (artistArr.length > 2) {
        return [songname, artistStr[1]];
      } else {
        return [songname, artistStr[0]];
      }
      
    });
    return out;
  }
  let query = {};
  let queryNoArtist = {};
  try {
    let stripInfo = cleanupSongString(req.query.song);
    if (stripInfo.length > 1) {
      var songTitle = stripInfo[1][0];
      var songArtist = stripInfo[1][1];
    } else {
      var songTitle = stripInfo[0][0];
      var songArtist = stripInfo[0][1];
    }
     query = {query: songTitle, artist: songArtist, type: 'release', country: 'Japan', year: req.query.year};
     queryNoArtist = {query: songTitle, type: 'release', country: 'Japan'};
  } catch {
    return res.json("ERROR");
  }
  


  // NOTE: Assumes all songs originated from Japan
  discogs.searchDatabase(query)
  .then((data) => {
    if (data.results.length > 0) {
      return res.json(data['results'][0])
    } else {
      discogs.searchDatabase(queryNoArtist)
      .then((data) => {
        if (data.results.length > 0) {
          return res.json(data['results'][0])
        } else {
          return res.json("ERROR");
        }
      })
      //return res.json("ERROR");
    }
    //res.json(data);
  })
  .catch((err) => {
    return res.json("ERROR");
  })
});

module.exports = router;
