const mongoose = require('mongoose');

// Models
const Director = require('../models/director-model');


class DirectorController {

	constructor(router) {
        this.router = router;
        this.routes();
	}
	
	async getAll(req, res) {
		try {
			const diretors = await Director.aggregate([
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
			return res.send(diretors);
		} 
		catch (error) {
			console.log();
		}
	}

    async getById(req, res) {
        try {
            const director = await Director.aggregate([
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
			return res.send(director);
        } 
        catch (error) {
           console.log(error);
        }
    }

    async update(req, res) {
        try {
			const director = await Director.findByIdAndUpdate(
				req.params.directorId, 
				req.body,
				{
					new: true //Güncellenmiş datayı döndürmek istiyorsak bunu kullanıyoruz.
				}
				);
			return res.send(director);
        } 
        catch (error) {
            console.log(error);
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
		this.router.get("/", this.getAll.bind(this));
		this.router.get("/:directorId", this.getById.bind(this));
		this.router.delete("/delete/:directorId", this.delete.bind(this));

        this.router.post("/add", this.create.bind(this));
		this.router.put("/edit/:directorId", this.update.bind(this));
    };
}

module.exports = DirectorController;
