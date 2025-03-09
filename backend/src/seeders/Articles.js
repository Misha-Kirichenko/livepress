const faker = require("faker");

module.exports = (conn) => {
	const queryInterface = conn.getQueryInterface();
	return {
		up: async (amount) => {
			const [[result]] = await queryInterface.sequelize.query(
				"SELECT COUNT(id) FROM articles;"
			);
			const { count: total } = result;

			if (total < amount) {
				const categories = await queryInterface.sequelize.query(
					"SELECT id FROM categories;"
				);
				const categoryIds = categories[0].map((c) => c.id);

				const admins = await queryInterface.sequelize.query(
					"SELECT id FROM users WHERE role = 'ADMIN';"
				);
				const adminIds = admins[0].map((a) => a.id);

				const articlesToSeed = Math.abs(amount - total);
				const articles = [...Array(articlesToSeed)].map(() => {
					return {
						title: faker.lorem.sentence().replace(/'/g, ""),
						description: faker.lorem.paragraphs(3).replace(/'/g, ""),
						category_id: faker.random.arrayElement(categoryIds),
						img: null,
						author_id: faker.random.arrayElement(adminIds),
						createDate: faker.time.recent("unix")
					};
				});

				console.log("Executing articles seeder...");

				await queryInterface.bulkInsert("articles", articles, {});

				console.log("Articles seeder executed successfully.");
			}
		},
		down: () => {
			return queryInterface.bulkDelete("articles", null, {});
		}
	};
};
