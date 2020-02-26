const Utils   = require('../helpers/utils');
const Types   = require('../helpers/types');

// ... Movie Model
const Movie   = require('../models/movie-model');

class MovieController {

	constructor(router) {
        this.router = router;
        this.routes();

        this.utils = new Utils();
  }

  // ... Get all movies in db
  async getAll(req, res, next){
    try {
      const movies = await Movie.aggregate([
        {
          $lookup: {
            from: 'directors',  //Aggregate with director collection
            localField: 'directorId', //Connect movie.directorId
            foreignField: '_id', //With director._id
            as: 'director'
          }
        },
        {
          $unwind: '$director'
        }
      ]);
      return res.send(this.utils.setResult(Types.Status.SUCCESS, 'success', movies));
    } 
    catch (error) {
      return res.send(this.utils.setResult(Types.Status.ERROR, error.messages, null));
    }
  };

  // ... Get top 10 movies in db
  async getTop10(req, res) {
    try {
      const movies = await Movie.find({}).limit(10).sort({ imdbScore: 1});
      return res.send(this.utils.setResult(Types.Status.SUCCESS, 'success', movies));
    } 
    catch (error) {
      return res.send(this.utils.setResult(Types.Status.ERROR, error.messages, null));
    }
  }

  // ... Get movie detail by movieId
  async getById(req, res){
    try {
      const movie = await Movie.findById(req.params.movieId);
      return res.send(this.utils.setResult(Types.Status.SUCCESS, 'success', movie));
    } 
    catch (error) {
      return res.send(this.utils.setResult(Types.Status.ERROR, error.messages, null));
    }
  };

  // ... Update movie detail by movieId
  async update(req, res) {
    try {
      const movie = await Movie.findByIdAndUpdate(
        req.params.movieId, 
        req.body,
        {
          useFindAndModify:  false,
          new: true // Update date if we want to see
        }
        );
      return res.send(this.utils.setResult(Types.Status.SUCCESS, 'success', movie));
    } 
    catch (error) {
      return res.send(this.utils.setResult(Types.Status.ERROR, error.messages, null));
    }
  }

  // ... Create a new movie
  async create(req, res) {
    try {
      const movie = await Movie.create(req.body);
      return res.send(this.utils.setResult(Types.Status.SUCCESS, 'success', movie));
    } 
    catch (error) {
      return res.send(this.utils.setResult(Types.Status.SUCCESS, error.messages, null));
    }
  }

  // ... Detele a movie with movieId
  async delete(req, res) {
    try {
      const movie = await Movie.findByIdAndRemove(req.params.movieId);
      return res.send(this.utils.setResult(Types.Status.SUCCESS, 'success', movie));
    } 
    catch (error) {
      return res.send(this.utils.setResult(Types.Status.ERROR, error.messages, null));
    }
  }

  // ... Get movie between given startYear and endYear
  async between(req, res) {
    try {
      const {startYear, endYear } = req.params;

      const movies = await Movie.find({
        year: { '$gte': parseInt(startYear), '$lte': parseInt(endYear)  }
      });
      return res.send(this.utils.setResult(Types.Status.SUCCESS, 'success', movies));
    } 
    catch (error) {
      return res.send(this.utils.setResult(Types.Status.ERROR, error.messages, null));
    }
  }
  
  // ... Routes
  routes() {
    this.router.get("/", this.getAll.bind(this));
    this.router.get("/top10", this.getTop10.bind(this));
    this.router.get("/:movieId", this.getById.bind(this));
    this.router.get("/between/:startYear/:endYear", this.between.bind(this));
    this.router.delete("/delete/:movieId", this.delete.bind(this));
    this.router.post("/add", this.create.bind(this));
    this.router.put("/edit/:movieId", this.update.bind(this));
  }
}


module.exports = MovieController;