const mongoose = require('mongoose');

module.exports = new mongoose.Schema({
    id: {type: Number, unique : true, required : true},
    email: {type: String, unique : true, required : true},
    password: {type: String, required: true},
    first_name: {type: String, required: true},
    last_name: {type: String, required: true},
    bio: String,
    own_projects_ids: Array,
    open_projects_ids: Array,
    created_at: String
});