const { Sequelize: DataTypes } = require("sequelize");
const { convertToEntities } = require("./hooks");

module.exports = (conn) => {
	const User = conn.define(
		"user",
		{
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true
			},
			name: { type: DataTypes.STRING, allowNull: false },
			surname: { type: DataTypes.STRING, allowNull: false },
			email: { type: DataTypes.STRING, unique: true, allowNull: false },
			nickName: { type: DataTypes.STRING, unique: true, allowNull: false },
			password: { type: DataTypes.STRING, allowNull: false },
			isBlocked: {
				type: DataTypes.BOOLEAN,
				defaultValue: false,
				allowNull: false
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
			lastLogin: { type: DataTypes.BIGINT, allowNull: false, defaultValue: 0 }
		},
		{
			timestamps: false,
			defaultScope: {
				attributes: { exclude: ["password"] }
			},
			scopes: {
				withPassword: {
					attributes: {}
				}
			},
			hooks: {
				beforeSave: (result) => {
					convertToEntities(result, "blockReason");
				}
			}
		}
	);
	return User;
};
