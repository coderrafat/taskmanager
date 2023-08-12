const { Schema, model } = require('mongoose');


const UsersSchema = new Schema({

    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    username: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    confirmPassword: {
        type: String,
        trim: true
    },
    role: {
        type: Number,
        default: 0
    }

}, { timestamps: true, versionKey: false });

const User = model('users', UsersSchema);

module.exports = User;