const mongoose 	 = require("mongoose");

const MovieSchema = mongoose.Schema({
    directorId: mongoose.Schema.Types.ObjectId,
    title: {
			type: String,
			required:  [true, '`{PATH}` alanı zorunludur.'],
			maxlength: [15, '`{PATH}` alanı (`{VALUE}`), ({MAXLENGTH}) karakterden küçük olmalıdır '],
			minlength: [3, '`{PATH}` alanı (`{VALUE}`), ({MINLENGTH}) karakterden büyük olmalıdır.']
    },
    category: {
    	type: String,
			maxlength: 30,
			minlength: 1,
		},
    country: {
			type: String,
			maxlength: 30,
			minlength: 1,
		},
    year: {
    	type: Number,
			max: 2040,
			min: 1900
		},
    imdbScore: {
    	type: Number,
			max: 10,
			min: 0
		},
    createOn: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('movie', MovieSchema);