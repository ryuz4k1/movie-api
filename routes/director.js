const express = require('express');
const router = express.Router();
const Movie = require('../models/movie-model');
const mongoose = require('mongoose');

// Models
const Director = require('../models/director-model');

router.post('/', (req, res, next) => {
  const director = new Director(req.body);
  director.save().then((data) => {
  	res.json(data);
	}).catch((err) => {
  	res.json(err);
	})
});


router.get('/', (req, res) => {
	const promise = Director.aggregate([
		{
			$lookup: {
				from: 'movies', //join edilecek collection adı
				localField: '_id', //director collectioundaki eşleşecek field
				foreignField: 'directorId', //movies collectionındaki eşleşecek field
				as: 'movies' //dönen datanın atanacağı ad
			}
		},
		{
			$unwind: {
				path: '$movies',
				preserveNullAndEmptyArrays: true //filmi olmayan yönetmenlerin listelemek için
			}
		},
		{
			$group: { //yukarıdaki directorun filmleri ile groupluyoruz, kümeliyoruz
				_id: {
					_id: '$_id',
					name: '$name',
					surname: '$surname',
					bio: '$bio'
				},
				movies: {
					$push: '$movies'
				}
			}
		},
		{
			$project: {
				_id: '$_id._id',
				name: '$_id.name',
				surname: '$_id.surname',
				movies: '$movies'
			}
		}
	]);

	promise.then((data) => {
		res.json(data);
	}).catch((err) => {
		res.json(err);
	});
});


router.get('/:directorId', (req, res) => {
	const promise = Director.aggregate([
        {
            $match: {
                '_id': mongoose.Types.ObjectId(req.params.directorId)
            }
        },
		{
			$lookup: {
				from: 'movies', //join edilecek collection adı
				localField: '_id', //director collectioundaki eşleşecek field
				foreignField: 'directorId', //movies collectionındaki eşleşecek field
				as: 'movies' //dönen datanın atanacağı ad
			}
		},
		{
			$unwind: {
				path: '$movies',
				preserveNullAndEmptyArrays: true //filmi olmayan yönetmenlerin listelemek için
			}
		},
		{
			$group: { //yukarıdaki directorun filmleri ile groupluyoruz, kümeliyoruz
				_id: {
					_id: '$_id',
					name: '$name',
					surname: '$surname',
					bio: '$bio'
				},
				movies: {
					$push: '$movies'
				}
			}
		},
		{
			$project: {
				_id: '$_id._id',
				name: '$_id.name',
				surname: '$_id.surname',
				movies: '$movies'
			}
		}
	]);

	promise.then((data) => {
		res.json(data);
	}).catch((err) => {
		res.json(err);
	});
});


module.exports = router;
