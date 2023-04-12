const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const clickSchema = new Schema({
    city:{
        type: String,
        required: true
    },
    country:{
        type:String,
        required: true
    },
    counter: {
        type: Number,
        required: true
    }
})

const clickModel = mongoose.model('Clicks', clickSchema);

module.exports = clickModel;