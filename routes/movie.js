const express = require('express');
const router = express.Router();
const Movie = require('../models/movie-model');


/* GET users listing. */

router.get('/', (req, res) => {
	const promise = Movie.aggregate([
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

	promise.then((data) => {
		res.json(data);
	}).catch((err) => {
		res.json(err);
	})
});

router.get('/top10', (req, res, next) => {

  const movies = Movie.find({}).limit(10).sort({ imdbScore: 1});
  movies.then((data) => {
    res.send(data);
  }).catch((err) => {
    res.send(err);
  });
});

router.get('/:movieId', (req, res, next) => {
  const movie = Movie.findById(req.params.movieId);

  if (!movie) {
    next({message: 'There no such a film'});
  }

  movie.then((data) => {  
    res.send(data);
  }).catch((err) => {
    res.send(err);
  });

});

router.put('/:movieId', (req, res, next) => {
  const movie = Movie.findOneAndUpdate(
    req.params.movieId, 
    req.body,
    {
      new: true //Güncellenmiş datayı döndürmek istiyorsak bunu kullanıyoruz.
    }
    );

  if (!movie) {
    next({message: 'There no such a film'});
  }

  movie.then((data) => {  
    res.send(data);
  }).catch((err) => {
    res.send(err);
  });

});

router.post('/', (req, res, next) => {
	// const { title, imdb_score, category, country, year } = req.body;

	const movie = new Movie(req.body);
	const promise = movie.save();

	promise.then((data) => {
		res.json(data);
	}).catch((err) => {
		res.json(err);
	});
});


router.delete('/:movie_id', (req, res, next) => {
	const promise = Movie.findByIdAndRemove(req.params.movie_id);

	promise.then((movie) => {
		if (!movie)
			next({ message: 'The movie was not found.', code: 99 });

		res.json({ status: 1 });
	}).catch((err) => {
		res.json(err);
	});
});


router.get('/between/:startYear/:endYear', (req, res, next) => {
  const {startYear, endYear } = req.params;

  const movies = Movie.find({
    year: { '$gte': parseInt(startYear), '$lte': parseInt(endYear)  }
  });

  movies.then((data) => {
    res.send(data);
  }).catch((err) => {
    res.send(err);
  });
});




module.exports = router;
