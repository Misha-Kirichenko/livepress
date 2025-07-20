const handleNewArticleNotification = require("./handleNewArticleNotification");
const handleNotifyAdminAboutReaction = require("./handleNotifyAdminAboutReaction");
const handleNotifyAdminAboutComment = require("./handleNotifyAdminAboutComment");
const handleNotifyUsersAboutComment = require("./handleNotifyUsersAboutComment");

module.exports = {
	handleNewArticleNotification,
	handleNotifyAdminAboutReaction,
	handleNotifyAdminAboutComment,
	handleNotifyUsersAboutComment
};
