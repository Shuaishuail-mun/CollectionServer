var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var config = require('../config');
const User = require('../modules/User');
var multer = require('multer');
const util = require('util');
const mkdirp = require('mkdirp');

var storage = multer.diskStorage({
  destination: async function (req, file, cb) {
    let dir = __dirname + "/../uploads";
    try {
      await mkdirp(dir);
      cb(null, dir);
    } catch (err) {
      cb(err);
    }
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' +file.originalname);
  }
});
var upload = multer({ storage: storage }).single('file');

router.post('/register', async function(req, res, next) {
  let data = req.body.data;
  let name = data.userName;
  let password = data.passWord;
  var hashedPassword = bcrypt.hashSync(password, 8);

  try {
    let user = await new User({
      username: name,
      password: hashedPassword,
      headImg: 'add-headimg.png'
    }).save();
    let token = jwt.sign({ id: user._id}, config.secret, {
      expiresIn: 86400 // expires in 24 hours
    });
    res.json({ auth: true, token: token });
    res.status(200).end();
  } catch (e) {
    console.error(e);
    throw e;
  }
});

router.post('/login', async function(req, res, next) {
  let data = req.body.data;
  let name = data.userName;
  let password = data.passWord;

  try {
    let user = await User.findOne({
      username: name,
    });
    if (user && bcrypt.compareSync(password, user.password)) {
      let token = jwt.sign({ id: user._id}, config.secret, {
        expiresIn: 86400 // expires in 24 hours
      });
      res.json({ auth: true, token: token });
      res.status(200).end();
    } else {
      res.json({ auth : false});
      res.end();
    }
  } catch (e) {
    console.error(e);
    throw e;
  }
});

router.post('/changeHead', function(req, res, next) {
  let token = req.cookies.token;
  if(!token) {
    res.json({ auth: false});
    res.end();
    return;
  }
  try {
    let payload = jwt.verify(token, config.secret);
    upload(req, res, async function (err) {
      if (err instanceof multer.MulterError) {
        res.status(500).json(err);
      } else if (err) {
        res.status(500).json(err);
      }
      let filename = req.file.filename;
      try{
        await User.findByIdAndUpdate(payload.id, {headImg: filename});
        res.status(200).json({auth: true, upload: true});
      }catch (e) {
        res.status(500).json({auth: true, upload: false});
      }
      res.end();
    });
  } catch (e) {
    res.json({ auth: false});
    res.end();
  }
});

router.get('/getHead', async function(req, res, next) {
  let token = req.cookies.token;
  if(!token) {
    res.json({ auth: false});
    res.end();
    return;
  }
  try {
    let payload = jwt.verify(token, config.secret);
    let user = await User.findById(payload.id, 'headImg');
    if(user) {
      res.json({ auth: true, headImg: user.headImg});
    }
    res.end();
  } catch (e) {
    console.error(e);
    throw e;
  }
});

router.get('/uploads/*', function (req, res) {
  let path = process.cwd() + req.url;
  res.sendFile(path);
  console.log("Request for " + path + " received.");
})

module.exports = router;
