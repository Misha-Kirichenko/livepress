const jwt = require("jsonwebtoken");

const authMiddleware = (socket, next) => {
	const token = socket.handshake.auth.token;

	if (!token) {
		return next(new Error("Authentication error: token missing"));
	}

	try {
		const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_KEY);
		socket.user = decoded;
		next();
	} catch (err) {
		return next(new Error("Authentication error: invalid token"));
	}
};

module.exports = authMiddleware;
