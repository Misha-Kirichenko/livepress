module.exports = (conn) => {
	const User = require("./User")(conn);
	const Category = require("./Category")(conn);
	const UserCategory = require("./UserCategory")(conn);
	const Article = require("./Article")(conn);
	const Reaction = require("./Reaction")(conn);
	const Comment = require("./Comment")(conn);

	User.belongsToMany(Category, {
		through: UserCategory,
		foreignKey: "user_id",
		otherKey: "category_id",
		as: "subscriptions"
	});

	Category.belongsToMany(User, {
		through: UserCategory,
		foreignKey: "category_id",
		otherKey: "user_id",
		as: "subscribers"
	});

	UserCategory.belongsTo(User, {
		foreignKey: "user_id",
		onDelete: "CASCADE",
		onUpdate: "CASCADE",
	});

	UserCategory.belongsTo(Category, {
		foreignKey: "category_id",
	});

	Article.belongsTo(User, {
		foreignKey: "author_id",
		as: "author",
		onDelete: "CASCADE",
		onUpdate: "CASCADE",
	});

	Article.belongsTo(Category, {
		foreignKey: "category_id",
		as: "category",
		onDelete: "CASCADE",
		onUpdate: "CASCADE",
	});

	Category.hasMany(Article, {
		foreignKey: "category_id",
		as: "articles"
	});

	User.hasMany(Article, {
		foreignKey: "author_id",
		as: "articles"
	});

	Reaction.belongsTo(Article, {
		foreignKey: "article_id",
		onDelete: "CASCADE",
		onUpdate: "CASCADE",
		as: "article"
	});

	Article.hasMany(Comment, {
		foreignKey: "article_id",
		as: "comments",
	});

	Comment.belongsTo(Article, {
		foreignKey: "article_id",
		as: "article",
		onDelete: "CASCADE",
		onUpdate: "CASCADE",
	});

	Comment.belongsTo(User, {
		foreignKey: "user_id",
		as: "author",
		onDelete: "CASCADE",
		onUpdate: "CASCADE",
	});

	return {
		User,
		Category,
		UserCategory,
		Article,
		Reaction,
		Comment
	};
};
