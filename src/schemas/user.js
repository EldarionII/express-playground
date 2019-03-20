const mongoose = require('mongoose');

module.exports = new mongoose.Schema({
    email: {type: String, required: true},
    password: {type: String, required: true},
    personal_data: {
        first_name: String,
        last_name: String,
        phone: String,
    },
});