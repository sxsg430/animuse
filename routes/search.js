var express = require('express');
var router = express.Router();
const Jikan = require('jikan-node');

/* GET home page. */
router.get('/', async (req, res, next) => {
  const mal = new Jikan();

  // Run Jikan's search function with the show title passed in through the URL's GET params.
  let maldat = mal.search('anime', req.query.title, {})
  .then(info => {
    // If the returned statuscode is '429', assume the server was ratelimited and return the appropriate code.
    if (info.status == "429") {
      let finalJson2 = {
        response: "Ratelimited",
      }
      res.json(finalJson2);
    } else {
      // Otherwise, construct JSON and return.
      let finalJson = {
        response: "N/A",
        search: info.results
      }
      res.json(finalJson);
    }
  })  
});

module.exports = router;
