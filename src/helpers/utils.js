"use strict"

const packageJson = require("../../package.json");

class Utils {

    setResult(code, message, data){
        let result = {
            code: code,
            message: message,
            data: data,
            time: Date.now(),
            api: {
                autor: packageJson.author,
                name: packageJson.name,
                description: packageJson.description,
                version: packageJson.version
            }
        }
        return result;
    };
}


module.exports = Utils;