const conn = require("@config/conn");
const { Article, Category, User } = require("@models")(conn);
const { Op } = require("sequelize");

exports.getMyList = async (userData, query) => {
	let articles = [];
	let subscriptions = null;
	let total = 0;

	const { role, id: user_id } = userData;
	const { page = 1, limit = 10, search, category_id } = query;

	const searchCondition = search
		? {
				[Op.or]: [
					{ title: { [Op.iLike]: `%${search}%` } },
					{ description: { [Op.iLike]: `%${search}%` } }
				]
		  }
		: {};

	if (role === "ADMIN") {
		total = await Article.count({
			where: {
				...searchCondition,
				...(category_id && { category_id })
			}
		});
		articles = await Article.findAll({
			where: {
				...searchCondition,
				...(category_id && { category_id })
			},
			attributes: { exclude: ["category_id", "description"] },
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
			],
			order: [
				[
					conn.literal(
						`CASE WHEN "author_id" = '${user_id}' THEN 0 ELSE 1 END`
					),
					"ASC"
				],
				["createDate", "DESC"]
			],
			limit,
			offset: (page - 1) * limit
		});
	} else {
		const user = await User.findByPk(user_id, {
			include: {
				model: Category,
				as: "subscriptions",
				attributes: ["id"],
				through: { attributes: [] }
			}
		});

		subscriptions = user.subscriptions.map((category) => category.id);
		total = await Article.count({
			where: {
				...searchCondition,
				...(category_id
					? { category_id }
					: { category_id: { [Op.in]: subscriptions } })
			}
		});
		articles = await Article.findAll({
			where: {
				...searchCondition,
				...(category_id
					? { category_id }
					: { category_id: { [Op.in]: subscriptions } })
			},
			attributes: { exclude: ["category_id", "description"] },
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
			],
			order: [["createDate", "DESC"]],
			limit,
			offset: (page - 1) * limit
		});
	}

	articles = {
		total,
		data: articles.map((article) => {
			const articleJson = article.toJSON();
			const articleWithPreviewText = {
				...articleJson,
				...(articleJson.author && {
					author: `${articleJson.author.name} ${articleJson.author.surname}`
				}),
				...(role === "USER" &&
					subscriptions &&
					category_id && {
						subOnCategory: subscriptions.includes(Number(category_id))
					}),
				category: articleJson.category.name
			};
			return articleWithPreviewText;
		})
	};

	return articles;
};
