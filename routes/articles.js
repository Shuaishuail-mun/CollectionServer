var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var config = require('../config');
const Article = require('../modules/Article');
const Comment = require('../modules/Comment');
const Favor = require('../modules/Favor');

router.get('/getById/:id', async function(req, res, next) {
    let id = req.params.id;
    console.log(id);
    try{
        let article = await Article.findById(id, '_id title text date').populate({ path: 'userId', select: 'username headImg' });
        let comments = await Comment.find({articleId: id}).populate({ path: 'userId', select: 'username headImg' });
        let favors = await Favor.find({articleId: id});
        res.json({query: true, article: article, comments: comments, favorNum: favors.length});
        res.end();
    }catch (e) {
        console.log(e);
    }
});

router.post('/search', async function(req, res, next) {
    let keyWords = req.body.keyWords;
    try{
        let articles = await Article.find({title: new RegExp(keyWords, 'i')}, '_id title');
        res.json({query: true, articles: articles});
        res.end();
    }catch (e) {
        console.log(e);
    }
});

router.get('/getPopular', async function(req, res, next) {
    let offset = parseInt(req.query.offset);
    let limit = parseInt(req.query.limit);
    try {
        let results = await Comment.aggregate([
            {$group : {_id : "$articleId", num_comment : {$sum : 1}}},
            {$sort: {num_comment: -1}},
            {$skip: offset},
            {$limit: limit},
            {$lookup: {from: 'articles', localField: '_id', foreignField: '_id', as: 'article'}},
            {$lookup: {from: 'users', localField: 'article.userId', foreignField: '_id', as: 'user'}}]);
        if (results) {
            res.json({query: true, results: results});
            res.end();
        }
    }catch (e) {
        console.log(e);
    }
});

router.get('/getRecent', async function(req, res, next) {
    try {
        /*let articles = await Article.findOne({title: 'happy'});
        articles = await Article.populate(articles, {
            path: "userId"
        });*/
        let articles = await Article.find().populate({ path: 'userId', select: 'username headImg' });
        if (articles) {
            res.json({query: true, articles: articles});
            res.end();
        }
    }catch (e) {
        console.log(e);
    }
});

router.post('/add', async function(req, res, next) {
    let token = req.cookies.token;
    if(!token) {
        res.json({ auth: false});
        res.end();
        return;
    }
    try{
        let payload = jwt.verify(token, config.secret);
        let title = req.body.title;
        let text = req.body.text;
        let description = req.body.description;
        let permit = req.body.permit;
        try {
            let article = new Article({
                title: title,
                description: description,
                text: text,
                userId: payload.id,
                permit: permit
                });
            article.save();
            res.json({ auth: true, published: true});
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