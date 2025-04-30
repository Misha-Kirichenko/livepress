const conn = require("@config/conn");
const path = require("path");
const { Op, QueryTypes } = require("sequelize");
const MESSAGES = require("@constants/messages");
const { Article, Category, User, Reaction } = require("@models")(conn);
const { MESSAGE_UTIL, createHttpException, deleteFile } = require("@utils");
const { REACTIONS_QUERY, USER_ASSOC_ARTICLE_QUERY } = require("@constants/sql");

const articlesPath = "user_uploads/articles";

exports.getArticle = async (id, userData) => {
	const getArticleByRole = async (role) => {
		let foundArticle = null;
		if (role === "ADMIN") {
			foundArticle = await Article.findOne({
				where: { id, author_id: userData.id },
				attributes: { exclude: ["category_id", "author_id"] },
				include: {
					model: Category,
					as: "category",
					attributes: ["name"]
				}
			});
		} else {
			const userCategories = await User.findByPk(userData.id, {
				include: {
					model: Category,
					as: "subscriptions",
					attributes: ["id", "name"],
					through: { attributes: [] }
				}
			});

			const subscriptions = userCategories.subscriptions.map(
				(category) => category.id
			);

			foundArticle = await Article.findOne({
				where: { id, category_id: { [Op.in]: subscriptions } },
				attributes: { exclude: ["category_id", "author_id"] },
				include: [
					{
						model: Category,
						as: "category",
						attributes: ["name"]
					},
					{
						model: User,
						as: "author",
						attributes: ["name", "surname"]
					}
				]
			});
		}
		return foundArticle;
	};

	let userReaction = null;
	const { role, id: user_id } = userData;
	const foundArticle = await getArticleByRole(role);

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
	}

	return {
		...foundArticle.toJSON(),
		...(foundArticle.author && {
			author: {
				author_id: foundArticle.author.id,
				fullName: `${foundArticle.author.name} ${foundArticle.author.surname}`
			}
		}),
		...(role === "USER" && { reaction: userReaction }),
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
		attributes: ["id"]
	});

	if (!foundCategory) {
		const notFoundException = createHttpException(
			404,
			MESSAGE_UTIL.ERRORS.NOT_FOUND("category")
		);
		throw notFoundException;
	}

	await Article.create({ ...articleData, author_id: user.id });
	return { msg: MESSAGE_UTIL.SUCCESS.CREATED("article") };
};

exports.updateArticle = async (req) => {
	const { file, body, user, params } = req;
	let relativeFilePath = null;

	const foundArticle = await Article.findOne({
		where: { id: params.id, author_id: user.id }
	});

	if (!foundArticle) {
		const notFoundException = createHttpException(
			404,
			MESSAGE_UTIL.ERRORS.NOT_FOUND("article")
		);
		throw notFoundException;
	}

	if (file) {
		relativeFilePath = path
			.join(articlesPath, file.filename)
			.replace(/\\/g, "/");

		await deleteFile(foundArticle.img);
	}

	const articleData = {
		...body,
		...(relativeFilePath && { img: relativeFilePath })
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
	return { msg: MESSAGE_UTIL.SUCCESS.UPDATED("article") };
};

exports.deleteArticle = async (user_id, article_id) => {
	const foundArticle = await Article.findOne({
		where: { id: article_id, author_id: user_id }
	});

	if (!foundArticle) {
		const notFoundException = createHttpException(
			404,
			MESSAGE_UTIL.ERRORS.NOT_FOUND("article")
		);
		throw notFoundException;
	}

	await foundArticle.destroy();
	await deleteFile(foundArticle.img);

	return { msg: MESSAGE_UTIL.SUCCESS.DELETED("article") };
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

exports.setArticleReaction = async (user_id, article_id, reaction) => {
	const userReaction = reaction.toUpperCase();

	const [checkResult] = await conn.query(USER_ASSOC_ARTICLE_QUERY, {
		replacements: { article_id, user_id },
		type: QueryTypes.SELECT
	});

	if (!checkResult.exist) {
		const notFoundException = createHttpException(
			404,
			MESSAGE_UTIL.ERRORS.NOT_FOUND("article")
		);
		throw notFoundException;
	}

	if (!checkResult.isInUserSubs) {
		const forbiddenException = createHttpException(
			403,
			MESSAGES.ERRORS.FORBIDDEN
		);
		throw forbiddenException;
	}

	const foundReaction = await Reaction.findOne({
		where: { user_id, article_id }
	});

	if (foundReaction) {
		if (foundReaction.reaction === userReaction) {
			await foundReaction.destroy();
		} else {
			await foundReaction.update({ reaction: userReaction });
		}
	} else {
		await Reaction.create({ user_id, article_id, reaction: userReaction });
	}

	const [result] = await conn.query(REACTIONS_QUERY, {
		replacements: { id: article_id },
		type: QueryTypes.SELECT
	});

	return {
		likes: parseInt(result.likes),
		dislikes: parseInt(result.dislikes)
	};
};
