// models/store

var mongoose    = require('mongoose');
var storeSchma  = mongoose.Schema({
    id: {
        type: Number,
        require: true,
    },
    name: {
        type: String,
        require: true,
    },
    uri: {
        type: String,
    },
})