const mongoose = require('mongoose');
let Comment;
const ObjectId = mongoose.SchemaTypes.ObjectId;

let commentSchema = new mongoose.Schema({
    articleId: {
        type: ObjectId,
        ref: 'Article',
        required: true
    },
    userId: {
        type: ObjectId,
        ref: 'User',
        required: true
    },
    text: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = Comment = mongoose.model('Comment', commentSchema);
