const conn = require("@config/conn");
const { QueryTypes, Op } = require("sequelize");
const { Comment, User } = require("@models")(conn);
const { MESSAGE_UTIL, createHttpException } = require("@utils");

exports.getArticleComments = async (userRole, article_id, query) => {
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

	const { page = 1, limit = 5 } = query;

	const where = { article_id };

	const include = [
		{
			model: User,
			as: "author",
			attributes: [
				"name",
				"surname",
				"nickName",
				...(userRole === "ADMIN" ? ["isBlocked", "blockReason"] : [])
			],
			...(userRole === "USER"
				? { where: { [Op.or]: [{ isBlocked: false }, { isBlocked: null }] } }
				: {}),
		}
	];

	const comments = await Comment.findAll({
		where,
		include,
		order: [["createDate", "DESC"]],
		limit,
		offset: (page - 1) * limit,
		attributes: { exclude: ["article_id", "user_id"] }
	});

	const countOptions = { where };

	if (userRole === "USER") {
		countOptions.include = [
			{
				model: User,
				as: "author",
				where: { [Op.or]: [{ isBlocked: false }, { isBlocked: null }] }
			}
		];
	}

	const total = await Comment.count(countOptions);

	return {
		data: comments,
		total
	};
};
