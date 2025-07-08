const conn = require("@config/conn");
const { QueryTypes } = require("sequelize");
const { Article, Reaction } = require("@models")(conn);
const { REACTIONS_QUERY } = require("@constants/sql");
const { createHttpException } = require("@utils");
const {
	handleNotifyAdminAboutReaction,
	handleSendReactions
} = require("@sockets/handlers");

exports.getArticleReactions = async (id) => {
	const [foundArticle] = await conn.query(
		"SELECT EXISTS(SELECT 1 FROM articles WHERE id = :id) AS exist",
		{ replacements: { id }, type: QueryTypes.SELECT }
	);

	if (!foundArticle.exist) {
		const notFoundException = createHttpException(
			404,
			MESSAGE_UTIL.ERRORS.NOT_FOUND("article")
		);
		throw notFoundException;
	}

	const [result] = await conn.query(REACTIONS_QUERY, {
		replacements: { id },
		type: QueryTypes.SELECT
	});

	return {
		likes: parseInt(result.likes),
		dislikes: parseInt(result.dislikes)
	};
};

exports.setArticleReaction = async (userData, article_id, reaction) => {
	let userReaction = reaction.toUpperCase();

	const foundArticle = await Article.findByPk(article_id);

	if (!foundArticle) {
		const notFoundException = createHttpException(
			404,
			MESSAGE_UTIL.ERRORS.NOT_FOUND("article")
		);
		throw notFoundException;
	}

	const foundReaction = await Reaction.findOne({
		where: { user_id: userData.id, article_id }
	});

	if (foundReaction) {
		if (foundReaction.reaction === userReaction) {
			userReaction = null; // If the user is trying to remove their reaction
			await foundReaction.destroy();
		} else {
			await foundReaction.update({ reaction: userReaction });
		}
	} else {
		await Reaction.create({
			user_id: userData.id,
			article_id,
			reaction: userReaction
		});
	}

	const [result] = await conn.query(REACTIONS_QUERY, {
		replacements: { id: article_id },
		type: QueryTypes.SELECT
	});

	const reactionsData = {
		likes: parseInt(result.likes),
		dislikes: parseInt(result.dislikes)
	};

	const socketNotiffs = [
		handleSendReactions(
			userData.nickName,
			article_id,
			reactionsData,
			userReaction
		),

		handleNotifyAdminAboutReaction(foundArticle, userData, userReaction)
	];

	await Promise.all(socketNotiffs);

	return reactionsData;
};
