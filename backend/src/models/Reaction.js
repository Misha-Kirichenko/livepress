const { Sequelize: DataTypes } = require("sequelize");

module.exports = (conn) => {
	const Reaction = conn.define(
		"reaction",
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
			article_id: {
				type: DataTypes.INTEGER,
				allowNull: false
			},
			reaction: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: { isIn: [["LIKE", "DISLIKE"]] }
			}
		},
		{
			timestamps: false,
			indexes: [
				{
					unique: true,
					fields: ["user_id", "article_id"]
				}
			]
		}
	);

	return Reaction;
};
