const express = require('express');
const router = express.Router();
const Movie = require('../models/movie-model');


/* GET users listing. */
router.get('/', (req, res, next) => {
  res.send('respond with a resource');
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

module.exports = router;
