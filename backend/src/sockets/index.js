let reactionsGateway = null;
let userNotificationsGateway = null;

const reactionsGatewaySetup = require("./gateways/reactions");
const userNotificationsGatewaySetup = require("./gateways/userNotifications");

const setupSocketNamespaces = (io) => {
	reactionsGateway = io.of("/reactions");
	userNotificationsGateway = io.of("/notifications/user");
	reactionsGatewaySetup(reactionsGateway);
	userNotificationsGatewaySetup(userNotificationsGateway);
};

const getReactionsGateway = () => {
	if (!reactionsGateway) {
		throw new Error("Reactions namespace is not initialized");
	}
	return reactionsGateway;
};

const getUserNotificationsGateway = () => {
	if (!userNotificationsGateway) {
		throw new Error("User notifications gateway is not initialized");
	}
	return userNotificationsGateway;
};

module.exports = {
	setupSocketNamespaces,
	getReactionsGateway,
	getUserNotificationsGateway
};
