var express = require('express');
var router = express.Router();
const Jikan = require('jikan-node');
/* GET home page. */
router.get('/', function(req, res, next) {
  const mal = new Jikan();
  let maldat = mal.findAnime('11597')
  .then(info => res.json(info));
});

module.exports = router;
