let articleInteractionsGateway = null;
let userNotificationsGateway = null;
let adminNotificationsGateway = null;

const {
	ARTICLE_INTERACTIONS,
	USER_NOTIFICATIONS,
	ADMIN_NOTIFICATIONS
} = require("@constants/sockets/namespaces");
const {
	articleInteractionsGatewaySetup,
	userNotificationsGatewaySetup,
	adminNotificationsGatewaySetup
} = require("./gateways");

const setupSocketNamespaces = (io) => {
	articleInteractionsGateway = io.of(ARTICLE_INTERACTIONS);
	userNotificationsGateway = io.of(USER_NOTIFICATIONS);
	adminNotificationsGateway = io.of(ADMIN_NOTIFICATIONS);
	articleInteractionsGatewaySetup(articleInteractionsGateway);
	userNotificationsGatewaySetup(userNotificationsGateway);
	adminNotificationsGatewaySetup(adminNotificationsGateway);
};

const getArticleInteractionsGateway = () => {
	if (!articleInteractionsGateway) {
		throw new Error("Article Interactions namespace is not initialized");
	}
	return articleInteractionsGateway;
};

const getUserNotificationsGateway = () => {
	if (!userNotificationsGateway) {
		throw new Error("User notifications gateway is not initialized");
	}
	return userNotificationsGateway;
};

const getAdminNotificationsGateway = () => {
	if (!adminNotificationsGateway) {
		throw new Error("Admin notifications gateway is not initialized");
	}
	return adminNotificationsGateway;
};

module.exports = {
	setupSocketNamespaces,
	getArticleInteractionsGateway,
	getUserNotificationsGateway,
	getAdminNotificationsGateway
};
