const { Sequelize: DataTypes } = require("sequelize");
const { convertToEntities } = require("./hooks");

module.exports = (conn) => {
	const Article = conn.define(
		"article",
		{
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true
			},
			title: { type: DataTypes.STRING, allowNull: false },
			description: { type: DataTypes.TEXT, allowNull: false },
			img: { type: DataTypes.STRING, allowNull: true, defaultValue: null },
			author_id: {
				type: DataTypes.INTEGER,
				allowNull: false
			},
			category_id: {
				type: DataTypes.INTEGER,
				allowNull: false
			},
			createDate: {
				type: DataTypes.BIGINT,
				allowNull: false,
				defaultValue: () => Date.now()
			}
		},
		{
			timestamps: false,
			hooks: {
				beforeCreate: (instance) => {
					convertToEntities(instance, "description");
				}
			}
		}
	);
	return Article;
};
