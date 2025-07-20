const conn = require("@config/conn");
const { Comment, Article } = require("@models")(conn);
const { MESSAGE_UTIL, createHttpException } = require("@utils");
const {
	handleSendNewComment,
	handleSendUpdateComment,
	handleSendDeleteComment,
	handleNotifyAdminAboutComment,
	handleNotifyUsersAboutComment
} = require("@sockets/handlers");

exports.createArticleComment = async (user, article_id, text) => {
	const foundArticle = await Article.findByPk(article_id, {
		attributes: ["id", "author_id", "title", "category_id"]
	});

	if (!foundArticle) {
		const notFoundException = createHttpException(
			404,
			MESSAGE_UTIL.ERRORS.NOT_FOUND("Article")
		);
		throw notFoundException;
	}

	const createdComment = await Comment.create({
		user_id: user.id,
		article_id,
		text
	});

	const commentData = {
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

	const commentDataForNotif = {
		createDate: Number(createdComment.createDate),
		article_id: foundArticle.id,
		article_title: foundArticle.title,
		article_author_id: foundArticle.author_id,
		article_category_id: foundArticle.category_id
	};

	const userDataForNotif = {
		id: user.id,
		name: user.name,
		surname: user.surname,
		nickName: user.nickName
	};

	const newCommentEvents = [
		handleSendNewComment(article_id, commentData),
		handleNotifyAdminAboutComment(userDataForNotif, commentDataForNotif),
		handleNotifyUsersAboutComment(userDataForNotif, commentDataForNotif)
	];

	await Promise.all(newCommentEvents);

	return commentData;
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

	const updatedComment = {
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

	await handleSendUpdateComment(foundComment.article_id, updatedComment);
	return updatedComment;
};

exports.deleteArticleComment = async (user, comment_id) => {
	const foundComment = await Comment.findOne({
		where: {
			id: comment_id,
			...(user.role === "USER" && { user_id: user.id })
		}
	});

	if (!foundComment) {
		const notFoundException = createHttpException(
			404,
			MESSAGE_UTIL.ERRORS.NOT_FOUND("comment")
		);
		throw notFoundException;
	}

	await foundComment.destroy();

	await handleSendDeleteComment(
		foundComment.article_id,
		Number(comment_id),
		user.nickName
	);

	return { message: MESSAGE_UTIL.SUCCESS.DELETED("comment") };
};
