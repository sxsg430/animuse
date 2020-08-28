var express = require('express');
var router = express.Router();
const Jikan = require('jikan-node');
/* GET home page. */
router.get('/:show', function(req, res, next) {
  const mal = new Jikan();
  let maldat = mal.findAnime(req.params['show'])
  .then(info => res.json(info))
  .catch(err => res.send(err));
});

module.exports = router;
