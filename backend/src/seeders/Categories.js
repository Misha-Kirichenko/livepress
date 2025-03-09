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
				return queryInterface.bulkInsert("categories", categories, {});
			}
			return;
		},
		down: () => {
			return queryInterface.bulkDelete("categories", null, {});
		}
	};
};
