module.exports = (conn) => {
	const queryInterface = conn.getQueryInterface();
	return {
		up: async () => {
			const [[result]] = await queryInterface.sequelize.query(
				"SELECT COUNT (id) FROM categories;"
			);
			const { count: total } = result;

			if (!parseInt(total)) {
				const categories = [
					{ name: "Sport" },
					{ name: "Art" },
					{ name: "Politics" },
					{ name: "Social" }
				];
				console.log("Executing categories seeder...");
				await queryInterface.bulkInsert("categories", categories, {});
			}
			console.log("categories seeder executed successfully.");
			return;
		},
		down: () => {
			return queryInterface.bulkDelete("categories", null, {});
		}
	};
};
