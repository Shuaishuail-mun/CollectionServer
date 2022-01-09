var express = require('express');
var router = express.Router();
const Favor = require('../modules/Favor');

/* GET users listing. */
router.get('/', async function(req, res, next) {
    /*this.locals.sequelize
        .authenticate()
        .then(() => {
            console.log('Connection has been established successfully.');
        })
        .catch(err => {
            console.error('Unable to connect to the database:', err);
        });*/

    let favors = await Favor.find();
    res.json({favors: favors});
    res.end();
    // res.json([{ username: "Shishi lee" }, { username: "Shishi lee" }, { username: "Shishi lee" }, { username: "Shishi lee" }]);
});

module.exports = router;
