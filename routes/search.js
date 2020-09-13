var express = require('express');
var router = express.Router();
const Jikan = require('jikan-node');

/* GET home page. */
router.get('/', async (req, res, next) => {
  const mal = new Jikan();

  let maldat = mal.search('anime', req.query.title, {})
  .then(info => {
    let finalJson = {
        response: "N/A",
        search: info.results
      }
    res.json(finalJson);
  })  
});

module.exports = router;
