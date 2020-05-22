var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var config = require('../config');
const Favor = require('../modules/Favor');
const User = require('../modules/User');

router.get('/check/:id', async function(req, res, next) {
    let token = req.cookies.token;
    if(!token) {
        res.json({ auth: false});
        res.end();
        return;
    }
    let id = req.params.id;
    try {
        let payload = jwt.verify(token, config.secret);
        let favor = await Favor.findOne({articleId: id, userId: payload.id});
        res.json({ auth: true, favor: favor});
        res.end();
    } catch (e) {
        console.log(e);
        res.json({ auth: false});
        res.end();
    }
});

router.post('/addOrDelete', async function(req, res, next) {
    let token = req.cookies.token;
    if(!token) {
        res.json({ auth: false});
        res.end();
        return;
    }
    try{
        let payload = jwt.verify(token, config.secret);
        let articleId = req.body.articleId;
        let favored = req.body.favored;
        try {
            if(favored) {
                let favor = new Favor({
                    articleId: articleId,
                    userId: payload.id
                });
                favor.save();
            } else {
                let result = await Favor.deleteMany({ articleId: articleId, userId: payload.id });
            }
            res.json({ auth: true, saved: true});
        }catch (e) {
            // query database error
            console.error(e);
        }
    }catch (e) {
        console.error(e);
        res.json({ auth: false});
    }
    res.end();
});

module.exports = router;