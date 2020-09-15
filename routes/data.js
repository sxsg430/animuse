var express = require('express');
var router = express.Router();
const Jikan = require('jikan-node');

/* GET home page. */
router.get('/:show', async (req, res, next) => {
  // Create Jikan variable
  const mal = new Jikan();

  // Use Jikan's search function to find information about the show ID passed in from the URL
  let maldat = mal.findAnime(req.params['show'])
  .then(info => {
    // If Successful, return custom JSON containing the necessary variables
    let finalJson = {
      response: "N/A",
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
  .catch(info => {
    // Otherwise, catch and return a default error code.
    let finalJson = {
      response: "ERROR",
    }
    res.json(finalJson);
  })
});

module.exports = router;
