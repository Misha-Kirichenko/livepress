const { Sequelize: DataTypes } = require("sequelize");
const { MIGRATION_UTIL, MESSAGE_UTIL } = require("@utils");

module.exports = (conn) => {
	const queryInterface = conn.getQueryInterface();
	return {
		up: async () => {
			const transaction = await conn.transaction();
			try {
				const [tableExists] = await queryInterface.sequelize.query(
					MIGRATION_UTIL.SELECT_TABLE("articles"),
					{ transaction }
				);

				if (!tableExists.length) {
					await queryInterface.createTable(
						"articles",
						{
							id: {
								type: DataTypes.INTEGER,
								primaryKey: true,
								autoIncrement: true
							},
							title: { type: DataTypes.STRING, allowNull: false },
							description: { type: DataTypes.TEXT, allowNull: false },
							img: {
								type: DataTypes.STRING,
								allowNull: true,
								defaultValue: null
							},
							author_id: {
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
							},
							createDate: {
								type: DataTypes.BIGINT,
								allowNull: false,
								defaultValue: Date.now
							}
						},
						{ transaction }
					);
					console.log(MESSAGE_UTIL.SUCCESS.MIGRATION("articles"));
				}
				await transaction.commit();
			} catch (error) {
				await transaction.rollback();
				throw error;
			}
		},
		down: async () => {
			await queryInterface.dropTable("articles");
		}
	};
};
