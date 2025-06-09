const crypto = require("crypto");
const { ARTICLE } = require("@constants/sockets/events");

const notificationUtil = {
	ARTICLE_NEW: (article) => {
		const { title, id, category_name, createDate } = article;
		const randomString = crypto.randomBytes(4).toString("hex");

		const newArticleMessage = {
			message: `New article in "${category_name}": "${title}"`,
			article_id: id,
			type: ARTICLE.NEW,
			notif_id: randomString,
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
	}
};

module.exports = notificationUtil;
