const mongoose = require('mongoose');
let Article;
const ObjectId = mongoose.SchemaTypes.ObjectId;

let articleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    text: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    },
    userId: {
        type: ObjectId,
        ref: 'User',
        required: true
    },
    permit: {
        type: Number
    }
});

module.exports = Article = mongoose.model('Article', articleSchema);
