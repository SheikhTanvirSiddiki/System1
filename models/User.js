const mongoose = require('mongoose');

// User schema
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    password: String
});

// User model
const User = mongoose.model('User', userSchema);

module.exports = User;
