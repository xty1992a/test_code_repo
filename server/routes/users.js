var express = require('express');
var router = express.Router();
const qs = require('qs');

/* GET users listing. */
router.get('/', function(req, res, next) {
  const [path, query] = req.originalUrl.split('?')
  console.log(qs.parse(query))
  setTimeout(() => {
	  res.json({success: true, data: [{name: '张三', id: 1, age: 11}, {name: '李四', id: 2,age: 10}]});
  }, 500)
});

module.exports = router;
