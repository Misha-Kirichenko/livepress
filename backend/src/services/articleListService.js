const conn = require("@config/conn");
const { Article, Category, User } = require("@models")(conn);
const { Op } = require("sequelize");

exports.getMyList = async (userData, query) => {
	let articles = [];
	let total = 0;

	const { role, id } = userData;
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
				author_id: id,
				...searchCondition,
				...(category_id && { category_id })
			}
		});
		articles = await Article.findAll({
			where: {
				author_id: id,
				...searchCondition,
				...(category_id && { category_id })
			},
			attributes: { exclude: ["category_id", "author_id", "description"] },
			include: {
				model: Category,
				as: "category",
				attributes: ["name"]
			},
			order: [["createDate", "DESC"]],
			limit,
			offset: (page - 1) * limit
		});
	} else {
		const user = await User.findByPk(id, {
			include: {
				model: Category,
				as: "subscriptions",
				attributes: ["id"],
				through: { attributes: [] }
			}
		});

		const subscriptions = user.subscriptions.map((category) => category.id);
		total = await Article.count({
			where: {
				category_id: { [Op.in]: subscriptions },
				...searchCondition,
				...(category_id && { category_id })
			}
		});
		articles = await Article.findAll({
			where: {
				category_id: { [Op.in]: subscriptions },
				...searchCondition,
				...(category_id && { category_id })
			},
			attributes: { exclude: ["category_id", "author_id", "description"] },
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
				category: articleJson.category.name
			};
			return articleWithPreviewText;
		})
	};

	return articles;
};
