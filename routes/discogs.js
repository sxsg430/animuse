var express = require('express');
var router = express.Router();
var Discojs = require('discojs');

/* GET users listing. */
router.get('/:song', function(req, res, next) {

  const discogs = new Discojs({
    userToken: process.env.DISCOGS_PERSONAL_TOKEN,
  });

  let cleanupSongString = function(songStr) {
    let finalStr = songStr.split(' by ')[0].replace('\"', '').replace('\"', '').replace(')', '').split(' (');
    return finalStr;
  }

  // NOTE: Assumes all songs originated from Japan
  discogs.searchDatabase({query: req.params['song'], type: 'release', country: 'Japan'})
  .then((data) => {
    res.json(data);
  })
  .catch((err) => {
    res.json(err);
  })
});

module.exports = router;
