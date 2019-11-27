const mongoose 	 = require("mongoose");

const DirectorSchema = mongoose.Schema({
	name: {
		type: String,
		maxlength: 60,
		minlength: 2
	},
	surname: {
		type: String,
		maxlength: 60,
		minlength: 2
	},
	bio: {
		type: String,
		maxlenght: 1000,
		minlength: 2
	},
	createOn: {
		type: Date,
		default: Date.now
	}
});

module.exports = mongoose.model('director', DirectorSchema);