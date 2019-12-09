"use strict"

const Utils = require("../helpers/utils");
const Types = require("../helpers/types");

class ExceptionMiddleware {

    errorHandler(err, req, res, next){
        const utils = new Utils();

        res.status(500);
        res.send(utils.setResult(Types.Status.ERROR, err.message, null));
    }

};


module.exports = ExceptionMiddleware;