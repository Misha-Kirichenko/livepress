const {
	handleNewArticleNotification,
	handleNotifyAdminAboutReaction,
	handleNotifyAdminAboutComment,
	handleNotifyUsersAboutComment,
	handleNotifyUserAboutBlock
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
	handleNotifyUsersAboutComment,
	handleNotifyUserAboutBlock
};
