"use strict";

const express                   = require("express");
const bodyParser                = require("body-parser");
const path                      = require('path');

// db Connection
const Connection                = require('../src/helpers/connection');

//Controllers
const IndexConroller            = require('./controllers/index-controller');
const MovieController           = require('./controllers/movie-controller');
const DirectorController        = require('./controllers/director-controller');

// Middleware
const verifyToken               = require('./middleware/verify-token');
const ExceptionMiddleware       = require('../src/middleware/expection-middleware');

//Config
const dotenv                    = require('dotenv').config();



class App {
  constructor() {
      this.app = express();

      this.config();
      this.controllers();

      this.Connection = new Connection().mongoDB();
  }

  config() {
    //db connection
    this.Connection;

    // ... Set app port
    //this.app.set("PORT", config.app.port);
    
    // ... Body parser
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(bodyParser.json()); //json tipinde gelicek post datalarını karşılar

    // view engine setup
    this.app.set('views', path.join(__dirname, 'views'));
    this.app.set('view engine', 'jade');

    //config
    this.app.set('apiKey', process.env.key);

  }

  controllers(){
    this.app.use("/public", express.static("public"));
      
    this.app.use('/api', verifyToken); //api ulaşmak için ilk başta verifyToken middlewaredan geçecek
    
    // ... Index Controller
    let router = express.Router();
    this.app.use("/", router);
    new IndexConroller(router);

    // ... Movie Controller
    router = express.Router();
    this.app.use("/api/movies", router);
    new MovieController(router);

    // ... Directors Controller
    router = express.Router();
    this.app.use("/api/directors", router);
    new DirectorController(router);
    
    // ... Exception middleware
    const exceptionMiddleware = new ExceptionMiddleware();
    this.app.use(exceptionMiddleware.errorHandler);
  };

  getApp() {
    return this.app;
  }

}

module.exports = App;
