const {
	handleNewArticleNotification,
	handleNotifyAdminAboutReaction
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
	handleSendReactions,
	handleSendNewComment,
	handleSendDeleteComment,
	handleSendUpdateComment
};
