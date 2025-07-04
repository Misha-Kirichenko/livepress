const conn = require("@config/conn");
const path = require("path");
const { QueryTypes } = require("sequelize");
const MESSAGES = require("@constants/messages");
const { Article, Category, User, Reaction } = require("@models")(conn);
const { MESSAGE_UTIL, createHttpException, deleteFile } = require("@utils");
const { REACTIONS_QUERY } = require("@constants/sql");
const {
	handleNewArticleNotification,
	handleNotifyAdminAboutReaction,
	handleSendReactions
} = require("@sockets/handlers");
const articlesPath = "user_uploads/articles";

exports.getArticle = async (id, userData) => {
	let userReaction = null;
	let subscriptions = null;

	const { role, id: user_id } = userData;

	const foundArticle = await Article.findOne({
		where: { id },
		attributes: { exclude: ["category_id", "author_id"] },
		include: [
			{
				model: Category,
				as: "category",
				attributes: ["id", "name"]
			},
			{
				model: User,
				as: "author",
				attributes: ["id", "name", "surname"]
			}
		]
	});

	if (!foundArticle) {
		const notFoundException = createHttpException(
			404,
			MESSAGE_UTIL.ERRORS.NOT_FOUND("article")
		);
		throw notFoundException;
	}

	if (role === "USER") {
		const foundReaction = await Reaction.findOne({
			where: {
				article_id: id,
				user_id
			},
			attributes: ["reaction"]
		});

		if (foundReaction) {
			userReaction = foundReaction.reaction;
		}
		const userCategories = await User.findByPk(userData.id, {
			include: {
				model: Category,
				as: "subscriptions",
				attributes: ["id"],
				through: { attributes: [] }
			}
		});

		subscriptions = userCategories.subscriptions.map((category) => category.id);
	}

	return {
		...foundArticle.toJSON(),
		author: {
			author_id: foundArticle.author.id,
			fullName: `${foundArticle.author.name} ${foundArticle.author.surname}`
		},
		...(role === "USER" &&
			subscriptions && {
				reaction: userReaction,
				subOnCategory: subscriptions.includes(foundArticle.category.id)
			}),
		category: foundArticle.category.name
	};
};

exports.createArticle = async (req) => {
	const { file, body, user } = req;
	const articleData = { ...body };

	if (file) {
		const relativeFilePath = path
			.join(articlesPath, file.filename)
			.replace(/\\/g, "/");

		articleData["img"] = relativeFilePath;
	}

	const foundCategory = await Category.findByPk(body.category_id, {
		attributes: ["id", "name"]
	});

	if (!foundCategory) {
		const notFoundException = createHttpException(
			404,
			MESSAGE_UTIL.ERRORS.NOT_FOUND("category")
		);
		throw notFoundException;
	}

	const foundCategoryPlain = foundCategory.get({ plain: true });

	const newArticle = await Article.create({
		...articleData,
		author_id: user.id
	});

	const articlePlain = newArticle.get({ plain: true });

	const requiredArticleData = {
		title: articlePlain.title,
		id: articlePlain.id,
		createDate: articlePlain.createDate,
		category_id: articlePlain.category_id,
		category_name: foundCategoryPlain.name
	};

	await handleNewArticleNotification(requiredArticleData);

	return { id: articlePlain.id, message: MESSAGE_UTIL.SUCCESS.CREATED("article") };
};

exports.updateArticle = async (req) => {
	let relativeFilePath;
	const { file, body, user, params } = req;
	const foundArticle = await Article.findByPk(params.id);

	if (!foundArticle) {
		const notFoundException = createHttpException(
			404,
			MESSAGE_UTIL.ERRORS.NOT_FOUND("article")
		);
		throw notFoundException;
	}

	if (foundArticle.author_id !== user.id) {
		const forbiddenException = createHttpException(
			403,
			MESSAGES.ERRORS.FORBIDDEN
		);
		throw forbiddenException;
	}

	if (file) {
		relativeFilePath = path
			.join(articlesPath, file.filename)
			.replace(/\\/g, "/");
		if (foundArticle.img) {
			await deleteFile(foundArticle.img);
		}
	} else if (JSON.parse(body.removeImage) && foundArticle.img) {
		relativeFilePath = null;
		delete body.removeImage;
		await deleteFile(foundArticle.img);
	}

	const articleData = {
		...body,
		...(relativeFilePath !== undefined && { img: relativeFilePath })
	};

	if (body.category_id) {
		const foundCategory = await Category.findByPk(body.category_id, {
			attributes: ["id"]
		});

		if (!foundCategory) {
			const notFoundException = createHttpException(
				404,
				MESSAGE_UTIL.ERRORS.NOT_FOUND("category")
			);
			throw notFoundException;
		}
	}

	for (const key in articleData) {
		foundArticle[key] = articleData[key];
	}

	await foundArticle.save();
	return { message: MESSAGE_UTIL.SUCCESS.UPDATED("article") };
};

exports.deleteArticle = async (user_id, article_id) => {
	const foundArticle = await Article.findByPk(article_id);

	if (!foundArticle) {
		const notFoundException = createHttpException(
			404,
			MESSAGE_UTIL.ERRORS.NOT_FOUND("article")
		);
		throw notFoundException;
	}

	if (foundArticle.author_id !== user_id) {
		const forbiddenException = createHttpException(
			403,
			MESSAGES.ERRORS.FORBIDDEN
		);
		throw forbiddenException;
	}

	await foundArticle.destroy();
	if (foundArticle.img) {
		await deleteFile(foundArticle.img);
	}

	return { message: MESSAGE_UTIL.SUCCESS.DELETED("article") };
};

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
		handleSendReactions(article_id, reactionsData, userReaction),
		handleNotifyAdminAboutReaction(foundArticle, userData, userReaction)
	];

	await Promise.all(socketNotiffs);

	return reactionsData;
};
