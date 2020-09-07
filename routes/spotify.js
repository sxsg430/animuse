var express = require('express');
var router = express.Router();
const Spotify = require('node-spotify-api');

/* GET users listing. */
router.get('/:song', function(req, res, next) {
  var spotify = new Spotify({
    id: process.env.SPOTIFY_CLIENT,
    secret: process.env.SPOTIFY_SECRET
  });
  let cleanupSongString = function(songStr) {
    let finalStr = songStr.split(' by ')[0].replace('\"', '').replace('\"', '').replace(')', '').split(' (');
    return finalStr;
  }

  spotify.search({type: 'track', query: req.params['song']})
  .then((data) => {
    try {
      return res.json(data['tracks']['items'][0]['uri']);
    } catch {
      return res.json("FAILED");
    }
  })
});

module.exports = router;
