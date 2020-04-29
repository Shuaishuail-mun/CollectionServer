const mongoose = require('mongoose');

let User;

let userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

userSchema.statics.register = async function (username, password) {

    let user = new User({
        username: username,
        password: password
    });

    return user.save();
};

module.exports = User = mongoose.model('User', userSchema);
