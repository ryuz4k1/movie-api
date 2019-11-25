const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MovieSchema = new Schema({
    directorId: {
        type: Schema.Types.ObjectId
    },
    title: {
        type: String,
        required: true
    },
    category: {
        type: String
    },
    country: {
        type: String
    },
    year: {
        type: Number
    },
    imdbScore: {
        type: Number
    },
    createdOn: {
        type: Date,
        default: Date.now
    }
});


module.exports = mongoose.model('movie', MovieSchema);
