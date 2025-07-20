const { ARTICLE } = require("@constants/sockets/events");

const notificationUtil = {
	ARTICLE_NEW: (article) => {
		const { title, id, category_name, createDate } = article;
		const newArticleMessage = {
			message: `New article in "${category_name}": "${title}"`,
			article_id: id,
			type: ARTICLE.NEW,
			createDate: Number(createDate)
		};

		return newArticleMessage;
	},
	USER_REACTION: (userData, reactionObj, article) => {
		const { id: user_id, name, surname } = userData;
		const userFullName = `${name} ${surname}`;
		const { type, createDate } = reactionObj;
		const { title, id } = article;

		const userReactionMessage = {
			message: `${userFullName} ${type.toLowerCase()}s article: "${title}"`,
			article_id: id,
			type: ARTICLE.REACTION,
			user_id,
			createDate
		};

		return userReactionMessage;
	},
	NEW_COMMENT: (userData, commentData) => {
		const { id: user_id, name, surname } = userData;
		const userFullName = `${name} ${surname}`;
		const { createDate, article_id, article_title } = commentData;

		const userCommentMessage = {
			message: `${userFullName} commented on article: "${article_title}"`,
			article_id,
			type: ARTICLE.NEW_COMMENT,
			user_id,
			createDate
		};

		return userCommentMessage;
	}
};

module.exports = notificationUtil;
