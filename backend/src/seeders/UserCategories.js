const faker = require("faker");

module.exports = (conn) => {
	const queryInterface = conn.getQueryInterface();
	return {
		up: async (amount) => {
			const [[result]] = await queryInterface.sequelize.query(
				"SELECT COUNT(id) FROM user_categories;"
			);
			const { count: total } = result;

			if (total < amount) {
				const users = await queryInterface.sequelize.query(
					"SELECT id FROM users WHERE role = 'USER';"
				);
				const userIds = users[0].map((u) => u.id);

				const categories = await queryInterface.sequelize.query(
					"SELECT id FROM categories;"
				);
				const categoryIds = categories[0].map((c) => c.id);

				const userCategoriesSet = new Set();
				const userCategoriesToSeed = Math.abs(amount - total);

				while (userCategoriesSet.size < userCategoriesToSeed) {
					const user_id = faker.random.arrayElement(userIds);
					const category_id = faker.random.arrayElement(categoryIds);
					if (!userCategoriesSet.has(`${user_id}-${category_id}`)) {
						userCategoriesSet.add(`${user_id}-${category_id}`);
					}
				}
				const userCategories = Array.from(userCategoriesSet).map((item) => {
					const [user_id, category_id] = item.split("-");
					return { user_id, category_id };
				});

				console.log("Executing user_categories seeder...");
				await queryInterface.bulkInsert("user_categories", userCategories, {});
				console.log("user_categories seeder executed successfully.");
			}
		},
		down: () => {
			return queryInterface.bulkDelete("user_categories", null, {});
		}
	};
};
