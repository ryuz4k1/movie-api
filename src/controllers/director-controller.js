const mongoose = require('mongoose');

// Models
const Director = require('../models/director-model');


class DirectorController {

	constructor(router) {
        this.router = router;
        this.routes();
    }

    async edit(req, res) {
        try {
            
        } 
        catch (error) {
           

        }
    }

    async update(req, res) {
        try {
            
        } 
        catch (error) {
            
        }
    }

    async create(req, res) {
        try {
			const director = await Director.create(req.body);

			return res.send(director);
        } 
        catch (error) {
			console.log(error);
		}
	}
	
	async delete(req, res) {
		try {
			const director = await Director.findByIdAndDelete(req.params.directorId);

			return res.send(director);
		} 
		catch (error) {
			console.log(error);
		}
	}

	routes() {
		this.router.get("/edit/:directorId", this.edit.bind(this));
		this.router.delete("/delete/:directorId", this.delete.bind(this));

        this.router.post("/add", this.create.bind(this));
		this.router.post("/edit", this.update.bind(this));
	
    }


}


/*


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


router.put('/:directorId', (req, res, next) => {
    const director = Director.findByIdAndUpdate(
      req.params.directorId, 
      req.body,
      {
        new: true //Güncellenmiş datayı döndürmek istiyorsak bunu kullanıyoruz.
      }
      );
  
      director.then((data) => {  
      res.send(data);
    }).catch((err) => {
      res.send(err);
    });
  
  });



  
  */

module.exports = DirectorController;
