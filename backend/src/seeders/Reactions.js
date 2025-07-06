const faker = require("faker");

module.exports = (conn) => {
	const queryInterface = conn.getQueryInterface();
	return {
		up: async (amount) => {
			const [[result]] = await queryInterface.sequelize.query(
				"SELECT COUNT(id) FROM reactions;"
			);
			const { count: total } = result;

			if (total < amount) {
				const users = await queryInterface.sequelize.query(
					"SELECT id FROM users WHERE role = 'USER';"
				);
				const userIds = users[0].map((u) => u.id);

				const articles = await queryInterface.sequelize.query(
					"SELECT id FROM articles;"
				);

				const articleIds = articles[0].map((a) => a.id);

				const reactions = ["LIKE", "DISLIKE"];
				const reactionsSet = new Set();
				const reactionsToSeed = Math.abs(amount - total);

				while (reactionsSet.size < reactionsToSeed) {
					const user_id = faker.random.arrayElement(userIds);
					const article_id = faker.random.arrayElement(articleIds);
					if (!reactionsSet.has(`${user_id}-${article_id}`)) {
						reactionsSet.add(`${user_id}-${article_id}`);
					}
				}

				const reactionsData = Array.from(reactionsSet).map((item) => {
					const [user_id, article_id] = item.split("-");
					const reaction = faker.random.arrayElement(reactions);
					return { user_id, article_id, reaction };
				});

				console.log("Executing reactions seeder...");
				await queryInterface.bulkInsert("reactions", reactionsData, {});
				console.log("reactions seeder executed successfully.");
			}
		},
		down: () => {
			return queryInterface.bulkDelete("reactions", null, {});
		}
	};
};
