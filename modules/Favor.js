const mongoose = require('mongoose');
let Favor;
const ObjectId = mongoose.SchemaTypes.ObjectId;

let favorSchema = new mongoose.Schema({
    articleId: {
        type: ObjectId,
        ref: 'Article',
        required: true
    },
    userId: {
        type: ObjectId,
        ref: 'User',
        required: true
    }
});

module.exports = Favor = mongoose.model('Favor', favorSchema);
