const faker = require("faker");
const { FIVE_MINUTES_IN_MS, FIVE_DAYS_IN_MS } = require("./time.constants");

module.exports = (conn) => {
	const queryInterface = conn.getQueryInterface();
	return {
		up: async (amount) => {
			const [[result]] = await queryInterface.sequelize.query(
				"SELECT COUNT(id) FROM comments;"
			);
			const { count: total } = result;

			if (total < amount) {
				const users = await queryInterface.sequelize.query(
					"SELECT id FROM users WHERE role = 'USER';"
				);
				const userIds = users[0].map((u) => u.id);

				const articles = await queryInterface.sequelize.query(
					`SELECT id, "createDate" FROM articles;`
				);

				const [articlesData] = articles;

				const commentsToSeed = Math.abs(amount - total);

				const commentsData = Array.from({ length: commentsToSeed }, () => {
					const randomArticleData = faker.random.arrayElement(articlesData);
					const article_id = randomArticleData.id;
					const addedRandomTime = faker.datatype.number({
						min: FIVE_MINUTES_IN_MS,
						max: FIVE_DAYS_IN_MS
					});
					const createDate =
						Number(randomArticleData["createDate"]) + addedRandomTime;

					const randomText = faker.lorem
						.sentences(faker.datatype.number({ min: 1, max: 3 }))
						.replace(/'/g, "&#39;");

					const randomUserId = faker.random.arrayElement(userIds);
					return {
						article_id,
						user_id: randomUserId,
						text: randomText,
						["createDate"]: createDate
					};
				});

				console.log("Executing comments seeder...");
				await queryInterface.bulkInsert("comments", commentsData, {});
				console.log("comments seeder executed successfully.");
			}
		},
		down: () => {
			return queryInterface.bulkDelete("comments", null, {});
		}
	};
};
