const {
	handleNewArticleNotification,
	handleNotifyAdminAboutReaction,
	handleNotifyAdminAboutComment,
	handleNotifyUsersAboutComment
} = require("./notifiers");

const {
	handleSendNewComment,
	handleSendReactions,
	handleSendDeleteComment,
	handleSendUpdateComment
} = require("./updaters");

module.exports = {
	handleNewArticleNotification,
	handleNotifyAdminAboutReaction,
	handleNotifyAdminAboutComment,
	handleSendReactions,
	handleSendNewComment,
	handleSendDeleteComment,
	handleSendUpdateComment,
	handleNotifyUsersAboutComment
};
