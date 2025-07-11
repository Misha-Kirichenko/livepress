const { Sequelize: DataTypes } = require("sequelize");
const { MIGRATION_UTIL, MESSAGE_UTIL } = require("@utils");

module.exports = (conn) => {
	const queryInterface = conn.getQueryInterface();
	return {
		up: async () => {
			const transaction = await conn.transaction();
			try {
				const [tableExists] = await queryInterface.sequelize.query(
					MIGRATION_UTIL.SELECT_TABLE("users"),
					{ transaction }
				);

				if (!tableExists.length) {
					await queryInterface.createTable(
						"users",
						{
							id: {
								type: DataTypes.INTEGER,
								primaryKey: true,
								autoIncrement: true
							},
							name: { type: DataTypes.STRING, allowNull: false },
							surname: { type: DataTypes.STRING, allowNull: false },
							email: { type: DataTypes.STRING, unique: true, allowNull: false },
							nickName: {
								type: DataTypes.STRING,
								unique: true,
								allowNull: false
							},
							password: { type: DataTypes.STRING, allowNull: false },
							isBlocked: {
								type: DataTypes.BOOLEAN,
								allowNull: true,
								defaultValue: null
							},
							blockReason: {
								type: DataTypes.STRING,
								allowNull: true,
								defaultValue: null
							},
							role: {
								type: DataTypes.STRING,
								defaultValue: "USER",
								allowNull: false,
								validate: { isIn: [["USER", "ADMIN"]] }
							},
							lastLogin: {
								type: DataTypes.BIGINT,
								allowNull: false,
								defaultValue: 0
							}
						},
						{ transaction }
					);
					console.log(MESSAGE_UTIL.SUCCESS.MIGRATION("users"));
				}
				await transaction.commit();
			} catch (error) {
				await transaction.rollback();
				throw error;
			}
		},
		down: async () => {
			await queryInterface.dropTable("users");
		}
	};
};
