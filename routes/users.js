var express = require('express');
var router = express.Router();

/* GET users listing. */
// domain:port/user/ 로 시작하는 라우터들 정리

router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
