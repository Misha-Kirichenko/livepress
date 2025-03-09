const { Sequelize: DataTypes } = require("sequelize");

module.exports = (conn) => {
	const UserCategory = conn.define(
		"user_category",
		{
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true
			},
			user_id: {
				type: DataTypes.INTEGER,
				allowNull: false
			},
			category_id: {
				type: DataTypes.INTEGER,
				allowNull: false
			}
		},
		{
			timestamps: false,
			indexes: [
				{
					unique: true,
					fields: ["user_id", "category_id"]
				}
			]
		}
	);

	return UserCategory;
};
