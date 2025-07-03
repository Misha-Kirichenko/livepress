const conn = require("@config/conn");
const { QueryTypes } = require("sequelize");
const { Comment, User } = require("@models")(conn);
const { MESSAGE_UTIL, createHttpException } = require("@utils");
const {} = require("@sockets/handlers");

exports.getArticleComments = async (article_id, query) => {
	const [foundArticle] = await conn.query(
		"SELECT EXISTS(SELECT 1 FROM articles WHERE id = :id) AS exist",
		{ replacements: { id: article_id }, type: QueryTypes.SELECT }
	);

	if (!foundArticle.exist) {
		const notFoundException = createHttpException(
			404,
			MESSAGE_UTIL.ERRORS.NOT_FOUND("article")
		);
		throw notFoundException;
	}

	const { page = 1, limit = 10 } = query;
	const comments = await Comment.findAll({
		where: { article_id },
		order: [["createDate", "DESC"]],
		limit,
		offset: (page - 1) * limit,
		include: [
			{
				model: User,
				as: "author",
				attributes: ["name", "surname", "nickName"]
			}
		],
		attributes: { exclude: ["article_id", "user_id"] }
	});

	const total = await Comment.count({ where: { article_id } });
	return {
		data: comments,
		total
	};
};

exports.createArticleComment = async (user, article_id, text) => {
	const [foundArticle] = await conn.query(
		"SELECT EXISTS(SELECT 1 FROM articles WHERE id = :id) AS exist",
		{ replacements: { id: article_id }, type: QueryTypes.SELECT }
	);

	if (!foundArticle.exist) {
		const notFoundException = createHttpException(
			404,
			MESSAGE_UTIL.ERRORS.NOT_FOUND("article")
		);
		throw notFoundException;
	}

	const createdComment = await Comment.create({
		user_id: user.id,
		article_id,
		text
	});

	return {
		id: createdComment.id,
		text: createdComment.text,
		createDate: createdComment.createDate,
		updateDate: createdComment.updateDate,
		author: {
			name: user.name,
			surname: user.surname,
			nickName: user.nickName
		}
	};
};

exports.updateArticleComment = async (user, comment_id, text) => {
	const foundComment = await Comment.findOne({
		where: {
			id: comment_id,
			user_id: user.id
		}
	});

	if (!foundComment) {
		const notFoundException = createHttpException(
			404,
			MESSAGE_UTIL.ERRORS.NOT_FOUND("comment")
		);
		throw notFoundException;
	}

	foundComment.text = text;
	await foundComment.save();

	return {
		id: foundComment.id,
		text: foundComment.text,
		createDate: foundComment.createDate,
		updateDate: String(foundComment.updateDate),
		author: {
			name: user.name,
			surname: user.surname,
			nickName: user.nickName
		}
	};
};

exports.deleteArticleComment = async (user, comment_id) => {
	const deletedComment = await Comment.destroy({
		where: {
			id: comment_id,
			...(user.role === "USER" && { user_id: user.id })
		}
	});

	if (!deletedComment) {
		const notFoundException = createHttpException(
			404,
			MESSAGE_UTIL.ERRORS.NOT_FOUND("comment")
		);
		throw notFoundException;
	}

	return { message: MESSAGE_UTIL.SUCCESS.DELETED("comment") };
};
