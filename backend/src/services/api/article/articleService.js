const conn = require("@config/conn");
const path = require("path");
const MESSAGES = require("@constants/messages");
const { Article, Category } = require("@models")(conn);
const { MESSAGE_UTIL, createHttpException, deleteFile } = require("@utils");
const { handleNewArticleNotification } = require("@sockets/handlers");
const articlesPath = "user_uploads/articles";

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

	return {
		id: articlePlain.id,
		message: MESSAGE_UTIL.SUCCESS.CREATED("article")
	};
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
		if (body.category_id && body.category_id !== foundArticle.category_id) {
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

			const foundCategoryPlain = foundCategory.get({ plain: true });
			const articlePlain = foundArticle.get({ plain: true });

			const requiredArticleData = {
				title: articlePlain.title,
				id: articlePlain.id,
				createDate: articlePlain.createDate,
				category_id: foundCategoryPlain.id,
				category_name: foundCategoryPlain.name
			};

			await handleNewArticleNotification(requiredArticleData);
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
