const mongoose = require('mongoose');
const Utils    = require('../helpers/utils');
const Types	   = require('../helpers/types');

// Director Model
const Director = require('../models/director-model');


class DirectorController {

	constructor(router) {
        this.router = router;
		this.routes();
		
		this.utils = new Utils();
	}
	
	// ... Get all director and director's movies in db
	async getAll(req, res) {
		try {
			const diretors = await Director.aggregate([
				{
					$lookup: {
						from: 'movies', //Join with movies collection
						localField: '_id', //Connect _id  
						foreignField: 'directorId', //With movies.directorId
						as: 'movies' //Alias movies
					}
				},
				{
					$unwind: {
						path: '$movies',
						preserveNullAndEmptyArrays: true //If movies return null, we can accept null array with this
					}
				},
				{
					$group: { //Group with director's movie together
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
					// ... Return attributes with project
					$project: {
						_id: '$_id._id',
						name: '$_id.name',
						surname: '$_id.surname',
						movies: '$movies'
					}
				}
			]);
			return res.send(this.utils.setResult(Types.Status.SUCCESS, 'success', diretors));
		} 
		catch (error) {
			return res.send(this.utils.setResult(Types.Status.ERROR, error.message, null));
		}
	}

	// ... Get director's movies with directorId
    async getById(req, res) {
        try {
            const director = await Director.aggregate([
				// .. First attributes matching with directorId
				{
					$match: {
						'_id': mongoose.Types.ObjectId(req.params.directorId)
					}
				},
				{
					$lookup: {
						from: 'movies', //Join with movies
						localField: '_id', //Connect director._id
						foreignField: 'directorId', //With movie.directorId
						as: 'movies' //Alias with movies
					}
				},
				{
					$unwind: {
						path: '$movies',
						preserveNullAndEmptyArrays: true
					}
				},
				{
					$group: {
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
						bio: '$_id.bio',
						movies: '$movies'
					}
				}
			]);
			return res.send(this.utils.setResult(Types.Status.SUCCESS, 'success', director));
        } 
        catch (error) {
			return res.send(this.utils.setResult(Types.Status.ERROR, error.message, null));
        }
    }

	// ... Update director's data with directorId
    async update(req, res) {
        try {
			const director = await Director.findByIdAndUpdate(
				req.params.directorId, //First find with directorId
				req.body, //Update with new data
				{
					new: true //If we want to see updated data, use this
				}
				);
				
			return res.send(this.utils.setResult(Types.Status.SUCCESS, 'success', director));
        } 
        catch (error) {
			return res.send(this.utils.setResult(Types.Status.ERROR, error.message, null));
        }
    }

	// ... Create a new director
    async create(req, res) {
        try {
			const director = await Director.create(req.body);
			return res.send(this.utils.setResult(Types.Status.SUCCESS, 'success', director));
        } 
        catch (error) {
			return res.send(this.utils.setResult(Types.Status.ERROR, error.message, null));
		}
	}
	
	// ... Delete a director with directorId
	async delete(req, res) {
		try {
			const director = await Director.findByIdAndDelete(req.params.directorId);
			return res.send(this.utils.setResult(Types.Status.SUCCESS, 'success', director));
		} 
		catch (error) {
			return res.send(this.utils.setResult(Types.Status.ERROR, error.message, null));
		}
	}
	
	// ... Routes
	routes() {
		this.router.get("/", this.getAll.bind(this));
		this.router.get("/:directorId", this.getById.bind(this));
		this.router.put("/edit/:directorId", this.update.bind(this));
		this.router.post("/add", this.create.bind(this));
		this.router.delete("/delete/:directorId", this.delete.bind(this));
    };
}

module.exports = DirectorController;
