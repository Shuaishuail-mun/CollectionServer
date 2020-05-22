const mongoose = require('mongoose');

let User;

let userSchema = new mongoose.Schema({
    username: {
        type: mongoose.SchemaTypes.String,
        required: true,
        unique: true
    },
    password: {
        type: mongoose.SchemaTypes.String,
        required: true
    },
    headImg: {
        type: mongoose.SchemaTypes.String
    }
});

// userSchema.statics.find = async function (username, password) {
//     let user = await User.findOne({
//         username: username,
//     });
//
//     return user;
// };

module.exports = User = mongoose.model('User', userSchema);
