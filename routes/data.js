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
  let maldat = mal.findAnime(req.params['show'])
  .then(info => {
    let finalJson = {
      showInfo: {
        mal_id: info.mal_id,
        mal_url: info.url,
        title: info.title,
        cover: info.image_url,
        media_type: info.type,
        origin: info.source,
        epcount: info.episodes,
        status: info.status,
        airing: info.airing,
        airdate: info.aired.string,
        description: info.synopsis,
        music: {
          opening: info.opening_themes,
          ending: info.ending_themes,
        }
      },
    }
    res.json(finalJson);
  })
  .catch(err => res.send(err));
});

module.exports = router;
