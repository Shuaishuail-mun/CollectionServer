var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.json([{ username: "Shishi lee" }, { username: "Shishi lee" }, { username: "Shishi lee" }, { username: "Shishi lee" }]);
});

module.exports = router;
