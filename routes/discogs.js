var express = require('express');
var router = express.Router();
var Discojs = require('discojs');

/* GET users listing. */
router.get('/', function(req, res, next) {

  const discogs = new Discojs({
    userToken: process.env.DISCOGS_PERSONAL_TOKEN,
  });

  let cleanupSongString = function(songStr) {
    let finalStr = songStr.split(' by ')[0].replace('\"', '').replace('\"', '').replace(')', '').split(' (');
    return finalStr;
  }
  let query = {query: req.query.song, artist: req.query.artist, type: 'release', country: 'Japan', year: req.query.year};
  
  // NOTE: Assumes all songs originated from Japan
  discogs.searchDatabase(query)
  .then((data) => {
    res.json(data);
  })
  .catch((err) => {
    res.json(err);
  })
});

module.exports = router;
