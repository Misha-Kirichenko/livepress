const conn = require("@config/conn");
const { Category, UserCategory, User } = require("@models")(conn);

const getAll = async () => {
	const all = await Category.findAll();
	return all;
};

const toggleSubscription = async (user_id, category_id) => {
	const deletedCount = await UserCategory.destroy({
		where: { user_id, category_id }
	});

	if (!deletedCount) {
		await UserCategory.create({ user_id, category_id });
	}
	const subscriptions = getSubscriptions(user_id);
	return subscriptions;
};

const getSubscriptions = async (user_id) => {
	const user = await User.findByPk(user_id, {
		include: {
			model: Category,
			as: "subscriptions",
			attributes: ["id", "name"],
			through: { attributes: [] }
		}
	});

	return user.subscriptions.map((category) => ({
		category_id: category.id,
		name: category.name
	}));
};

module.exports = { getAll, getSubscriptions, toggleSubscription };
