const { Sequelize: DataTypes } = require("sequelize");
const { mutateDates, convertToEntities } = require("./hooks");

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
				defaultValue: Date.now
			}
		},
		{
			timestamps: false,
			hooks: {
				beforeUpdate: (result) => {
					delete result.dataValues.createDate;
				},
				beforeSave: (result) => {
					convertToEntities(result, "description");
				},
			}
		}
	);
	return Article;
};
