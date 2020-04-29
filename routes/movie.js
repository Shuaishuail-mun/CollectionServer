var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    this.locals.sequelize
        .authenticate()
        .then(() => {
            console.log('Connection has been established successfully.');
        })
        .catch(err => {
            console.error('Unable to connect to the database:', err);
        });
    // res.json([{ username: "Shishi lee" }, { username: "Shishi lee" }, { username: "Shishi lee" }, { username: "Shishi lee" }]);
});

module.exports = router;
