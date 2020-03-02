"use strict";

const mongoose = require("mongoose");

class Connection {

    // ... Mongodb 
    mongoDB() {
        const mongodb =  mongoose.connect(process.env.endPoint,{useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true });
        mongoose.connection.on('open', () => {
            console.log('Connected');
        });
        mongoose.connection.on('error', (err) => {
            console.log(err);
        });
        return mongodb;
    };
};

module.exports = Connection;