const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = new Schema({
    nombre: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    root: { type: String, required: true }
});

module.exports = mongoose.model('User', User)