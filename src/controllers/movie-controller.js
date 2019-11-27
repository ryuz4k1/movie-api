const Movie   = require('../models/movie-model');

class MovieController {

	constructor(router) {
        this.router = router;
        this.routes();
    }

    async getAll(req, res){
      try {
        const movies = await Movie.aggregate([
          {
            $lookup: {
              from: 'directors',  //director collectionı ile aggregate
              localField: 'directorId', //movie directorId ile
              foreignField: '_id', //director collectionundaki id eşleşsin
              as: 'director'
            }
          },
          {
            $unwind: '$director'
          }
        ]);
        return res.send(movies);
      } 
      catch (error) {
        console.log(error);
      }
    };

    async getTop10(req, res) {
      try {
        const movies = await Movie.find({}).limit(10).sort({ imdbScore: 1});
        return res.send(movies);
      } 
      catch (error) {
        
      }
    }

    async getById(req, res){
      try {
        const movie = await Movie.findById(req.params.movieId);
        return res.send(movie);
      } 
      catch (error) {
        console.log(error);
      }
    };

    async update(req, res) {
      try {
        const movie = await Movie.findOneAndUpdate(
          req.params.movieId, 
          req.body,
          {
            new: true //Güncellenmiş datayı döndürmek istiyorsak bunu kullanıyoruz.
          }
          );
        return res.send(movie);
      } 
      catch (error) {
        
      }
    }

    async create(req, res) {
      try {
        const movie = await Movie.create(req.body);
        return res.send(movie);
      } 
      catch (error) {
        console.log(error);
      }
    }

  async delete(req, res) {
    try {
      const movie = await Movie.findByIdAndRemove(req.params.movieId);
      return res.send(movie);
    } 
    catch (error) {
      console.log(error);
    }
  }

  async between(req, res) {
    try {
      const {startYear, endYear } = req.params;

      const movies = await Movie.find({
        year: { '$gte': parseInt(startYear), '$lte': parseInt(endYear)  }
      });
      return res.send(movies);
    } 
    catch (error) {
      console.log(error);
    }
  }

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