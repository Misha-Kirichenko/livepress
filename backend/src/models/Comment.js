const { Sequelize: DataTypes } = require("sequelize");
const { convertToEntities } = require("./hooks");

module.exports = (conn) => {
	const Comment = conn.define(
		"comments",
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
			createDate: {
				type: DataTypes.BIGINT,
				allowNull: false,
				defaultValue: () => Date.now()
			},
			updateDate: {
				type: DataTypes.BIGINT,
				allowNull: false,
				defaultValue: 0
			},
			text: {
				type: DataTypes.TEXT,
				allowNull: false,
				validate: {
					notEmpty: true
				}
			}
		},
		{
			timestamps: false,
			hooks: {
				beforeUpdate: (result) => {
					result.set("updateDate", Date.now());
				},
				beforeSave: (result) => {
					convertToEntities(result, "text");
				}
			}
		}
	);

	return Comment;
};
