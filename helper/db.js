const mongoose = require('mongoose');


module.exports = () => {
    mongoose.connect('mongodb://ryuz4k1:element17@ds059957.mlab.com:59957/movie-api-core',{ useNewUrlParser: true, useUnifiedTopology: true })
    mongoose.connection.on('open', () => {
        console.log('Connected');
    });
    mongoose.connection.on('error', (err) => {
        console.log(err);
    });
};

