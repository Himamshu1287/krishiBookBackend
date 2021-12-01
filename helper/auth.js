require('dotenv').config();
const jwt = require('jsonwebtoken');
module.exports = {
	//verify token
    verifyAuthToken: function (req, res, next) {
		const token =req.headers["Authorization"] || req.headers["authorization"] || req.headers["x-access-token"];
		if (!token) {
			return res.status(403).send(msg.errorMessage.requiredToken);
		}
		try {
			const decoded = jwt.verify(token,process.env.JWT_SECRETKEY);
			let data = decoded.data;
			req.userId = data.userId;
			req.role = data.role;

			return next();
		} catch (err) {
			return res.status(401).send(msg.errorMessage.tokenFailed);
		}
		
	},
	//create token
	getAccessToken: function (userId, role) {
		var data = {userId:userId, role:role };
		return jwt.sign({ exp: Math.floor(Date.now() / 1000) + (18*60*60), data: data }, process.env.JWT_SECRETKEY);
	}
}