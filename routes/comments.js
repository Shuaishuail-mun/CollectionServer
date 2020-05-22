var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var config = require('../config');
const Comment = require('../modules/Comment');
const User = require('../modules/User');

router.post('/add', async function(req, res, next) {
    let token = req.cookies.token;
    if(!token) {
        res.json({ auth: false});
        res.end();
        return;
    }
    try{
        let payload = jwt.verify(token, config.secret);
        let articleId = req.body.articleId;
        let text = req.body.text;
        try {
            let comment = new Comment({
                articleId: articleId,
                userId: payload.id,
                text: text
            });
            comment.save();
            let user = await User.findById(payload.id, 'username headImg');
            res.json({ auth: true, published: true, user: user});
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