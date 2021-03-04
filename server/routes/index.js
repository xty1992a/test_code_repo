var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/gas', function(req, res, next) {
  res.set('cache-control', 'no-store')
  res.render('index', { title: 'Express' });
});

module.exports = router;
