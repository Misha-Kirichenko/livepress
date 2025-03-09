const { Sequelize: DataTypes } = require("sequelize");

module.exports = (conn) => {
	const Category = conn.define(
		"category",
		{
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true
			},
			name: { type: DataTypes.STRING, allowNull: false, unique: true }
		},
		{
			timestamps: false
		}
	);
	return Category;
};
