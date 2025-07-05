const { Sequelize: DataTypes } = require("sequelize");
const { MIGRATION_UTIL, MESSAGE_UTIL } = require("@utils");

module.exports = (conn) => {
	const queryInterface = conn.getQueryInterface();
	return {
		up: async () => {
			const transaction = await conn.transaction();
			try {
				const [tableExists] = await queryInterface.sequelize.query(
					MIGRATION_UTIL.SELECT_TABLE("comments"),
					{ transaction }
				);

				if (!tableExists.length) {
					await queryInterface.createTable(
						"comments",
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
							createDate: {
								type: DataTypes.BIGINT,
								allowNull: false,
								defaultValue: Date.now
							},
							updateDate: {
								type: DataTypes.BIGINT,
								allowNull: false,
								defaultValue: 0
							},
							text: {
								type: DataTypes.TEXT,
								allowNull: false
							}
						},
						{ transaction }
					);

					console.log(MESSAGE_UTIL.SUCCESS.MIGRATION("comments"));
				}
				await transaction.commit();
			} catch (error) {
				await transaction.rollback();
				throw error;
			}
		},
		down: async () => {
			await queryInterface.dropTable("comments");
		}
	};
};
