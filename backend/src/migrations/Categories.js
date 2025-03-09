const { Sequelize: DataTypes } = require("sequelize");
const { MIGRATION_UTIL, MESSAGE_UTIL } = require("@utils");

module.exports = (conn) => {
	const queryInterface = conn.getQueryInterface();
	return {
		up: async () => {
			const transaction = await conn.transaction();
			try {
				const [tableExists] = await queryInterface.sequelize.query(
					MIGRATION_UTIL.SELECT_TABLE("categories"),
					{ transaction }
				);

				if (!tableExists.length) {
					await queryInterface.createTable(
						"categories",
						{
							id: {
								type: DataTypes.INTEGER,
								primaryKey: true,
								autoIncrement: true
							},
							name: { type: DataTypes.STRING, allowNull: false, unique: true }
						},
						{ transaction }
					);
					console.log(MESSAGE_UTIL.SUCCESS.MIGRATION("categories"));
				}
				await transaction.commit();
			} catch (error) {
				await transaction.rollback();
				throw error;
			}
		},
		down: async () => {
			await queryInterface.dropTable("categories");
		}
	};
};
