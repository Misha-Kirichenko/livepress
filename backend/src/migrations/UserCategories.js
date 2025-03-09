const { Sequelize: DataTypes } = require("sequelize");
const { MIGRATION_UTIL, MESSAGE_UTIL } = require("@utils");

module.exports = (conn) => {
	const queryInterface = conn.getQueryInterface();
	return {
		up: async () => {
			const transaction = await conn.transaction();
			try {
				const [tableExists] = await queryInterface.sequelize.query(
					MIGRATION_UTIL.SELECT_TABLE("user_categories"),
					{ transaction }
				);

				if (!tableExists.length) {
					await queryInterface.createTable(
						"user_categories",
						{
							id: {
								type: DataTypes.INTEGER,
								primaryKey: true,
								autoIncrement: true
							},
							user_id: {
								type: DataTypes.INTEGER,
								allowNull: false,
								references: {
									model: "users",
									key: "id"
								},
								onUpdate: "CASCADE",
								onDelete: "CASCADE"
							},
							category_id: {
								type: DataTypes.INTEGER,
								allowNull: false,
								references: {
									model: "categories",
									key: "id"
								},
								onUpdate: "CASCADE",
								onDelete: "CASCADE"
							}
						},
						{ transaction }
					);
					await queryInterface.addIndex(
						"user_categories",
						["user_id", "category_id"],
						{
							unique: true,
							name: "user_category_unique_idx",
							transaction
						}
					);
					console.log(MESSAGE_UTIL.SUCCESS.MIGRATION("user_categories"));
				}
				await transaction.commit();
			} catch (error) {
				await transaction.rollback();
				throw error;
			}
		},
		down: async () => {
			await queryInterface.dropTable("user_categories");
		}
	};
};
