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
    desc: {
        type: String,
    },
    // 유형 정의 필요.
    lat: {
        type:Number,    
    },
    lng: {
        type:Number,
    },
    tags: {
        type: String,
    }
});

let Store   = mongoose.model('store', storeSchma);
module.exports = Store;