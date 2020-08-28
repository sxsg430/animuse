var express = require('express');
var router = express.Router();
const Jikan = require('jikan-node');
const Spotify = require('node-spotify-api');

/* GET home page. */
router.get('/:show', function(req, res, next) {
  const mal = new Jikan();
  var spotify = new Spotify({
    id: process.env.SPOTIFY_CLIENT,
    secret: process.env.SPOTIFY_SECRET
  });
  let maldat = mal.findAnime(req.params['show']);

  spotify.search({type: 'track', query: 'Synchrogazer'})
  .then(function(response) {
    res.json(response);
  })
  .catch(function(err) {
    res.json(err)
  });
  //.then(info => res.json(info))
  //.catch(err => res.send(err));
});

module.exports = router;
