var express = require('express');
var router = express.Router();
const User = require('../modules/User');

router.post('/register', function(req, res, next) {
  let data = req.body.data;
  let name = data.userName;
  let password = data.passWord;

  try {
    let user = User.register(name, password);
  } catch (e) {
    console.error(e);
    throw e;
  }

  res.json({code:1});
  res.status(201).end();
});

module.exports = router;
