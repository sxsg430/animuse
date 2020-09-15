var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  // Default endpoint
  res.send("Nothing Here");
});

module.exports = router;
