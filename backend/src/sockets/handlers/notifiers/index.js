const handleNewArticleNotification = require("./handleNewArticleNotification");
const handleNotifyAdminAboutReaction = require("./handleNotifyAdminAboutReaction");
const handleNotifyAdminAboutComment = require("./handleNotifyAdminAboutComment");
const handleNotifyUsersAboutComment = require("./handleNotifyUsersAboutComment");
const handleNotifyUserAboutBlock = require("./handleNotifyUserAboutBlock");

module.exports = {
	handleNewArticleNotification,
	handleNotifyAdminAboutReaction,
	handleNotifyAdminAboutComment,
	handleNotifyUsersAboutComment,
	handleNotifyUserAboutBlock
};
