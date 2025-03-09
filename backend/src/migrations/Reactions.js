const { Sequelize: DataTypes } = require("sequelize");
const { MIGRATION_UTIL, MESSAGE_UTIL } = require("@utils");

module.exports = (conn) => {
	const queryInterface = conn.getQueryInterface();
	return {
		up: async () => {
			const transaction = await conn.transaction();
			try {
				const [tableExists] = await queryInterface.sequelize.query(
					MIGRATION_UTIL.SELECT_TABLE("reactions"),
					{ transaction }
				);

				if (!tableExists.length) {
					await queryInterface.createTable(
						"reactions",
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
							article_id: {
								type: DataTypes.INTEGER,
								allowNull: false,
								references: {
									model: "articles",
									key: "id"
								},
								onUpdate: "CASCADE",
								onDelete: "CASCADE"
							},
							reaction: {
								type: DataTypes.STRING,
								allowNull: false,
								validate: {
									isIn: [["LIKE", "DISLIKE"]]
								}
							}
						},
						{ transaction }
					);

					await queryInterface.addIndex(
						"reactions",
						["user_id", "article_id"],
						{
							unique: true,
							name: "reaction_unique_idx",
							transaction
						}
					);

					console.log(MESSAGE_UTIL.SUCCESS.MIGRATION("reactions"));
				}
				await transaction.commit();
			} catch (error) {
				await transaction.rollback();
				throw error;
			}
		},
		down: async () => {
			await queryInterface.dropTable("reactions");
		}
	};
};
