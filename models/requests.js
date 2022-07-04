const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Requests = new Schema ({
        Id: { type: Number, required: true },
        time:{ type: Date, default: Date.now }
});

module.exports = mongoose.model('Requests', Requests)