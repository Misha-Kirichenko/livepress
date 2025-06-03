const notificationUtil = {
	ARTICLE_NEW: (article) => {
		const { title, id, category_name, createDate } = article;

		const newArticleMessage = {
			message: `New article in "${category_name}": "${title}"`,
			article_id: id,
			createDate: Number(createDate),
		};

		return newArticleMessage;
	}
};

module.exports = notificationUtil;
