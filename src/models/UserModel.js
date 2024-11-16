const mongoose = require('mongoose');
const {isEmail} = require('validator');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required:[ true, 'Please enter a User name.' ],
        unique: true
    },
    password: {
        type: String,
        required: [ true, 'Please enter a password.' ],
        minlength: [ 6, 'Password must be at least 6 characters long.'],
    },
    email: {
        type: String,
        required: [ true, 'Please enter an email.' ],
        unique: true,
        lowercase: true,
        trim: true,
        validate: [ isEmail, 'Please enter a valid email.']
    },
    favoriterecipes:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Recipe'
        }
    ],
    createdrecipes:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Recipe'
        }
    ]
}, {timestamps: true});

const UserModel = mongoose.model('User', UserSchema);
module.exports = UserModel;