const jwt = require('jsonwebtoken');
const config = require("../../config.json");

module.exports = (req, res, next) => {
	//Token 3 yol ile gelebilir. Header, body ve query ile.
	const token = req.headers['x-access-token'] || req.body.token || req.query.token

	if(token){
		jwt.verify(token, config.apiKey.key, (err, decoded) => {
			if (err){
				res.json({
					status: false,
					message: 'Failed to authenticate token.'
				})
			}else{
				req.decode = decoded;
				next(); //her şey yolunda, herhangi bi routea gidebilirsin
			}
		});
	}else{
		res.json({
			status: false,
			message: 'No token provided.'
		})
	}
};