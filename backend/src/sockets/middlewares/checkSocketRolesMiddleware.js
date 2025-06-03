const MESSAGES = require("@constants/messages");

const checkSocketRolesMiddleware = (roles) => (socket, next) => {
	if (!roles.includes(socket.user.role)) {
		return next(new Error(MESSAGES.ERRORS.FORBIDDEN));
	}
	return next();
};

module.exports = checkSocketRolesMiddleware;
