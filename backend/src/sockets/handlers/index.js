const {
	handleNewArticleNotification,
	handleNotifyAdminAboutReaction,
	handleNotifyAdminAboutComment
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
	handleSendUpdateComment
};
