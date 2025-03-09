const { Sequelize: DataTypes } = require("sequelize");
const { mutateDates } = require("./hooks");

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
			password: { type: DataTypes.STRING, allowNull: false },
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
			hooks: {
				afterFind: (result) => mutateDates(result, "lastLogin")
			},
			defaultScope: {
				attributes: { exclude: ["password"] }
			},
			scopes: {
				withPassword: {
					attributes: {}
				}
			}
		}
	);
	return User;
};
