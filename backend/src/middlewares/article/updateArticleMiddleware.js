const { body } = require("express-validator");

const updateArticleMiddleware = [
	body("title")
		.optional()
		.trim()
		.escape()
		.custom((value) => {
			if (!isNaN(value)) {
				throw new Error("title must be a string");
			}
			return true;
		})
		.isString()
		.withMessage("title must be a string")
		.isLength({ max: 255 })
		.withMessage("title maximum length must be equal or less than 255"),

	body("description")
		.optional()
		.trim()
		.escape()
		.custom((value) => {
			if (!isNaN(value)) {
				throw new Error("description must be a string");
			}
			return true;
		})
		.isString()
		.withMessage("description must be a string"),

	body("category_id")
		.optional()
		.isInt({ min: 1 })
		.withMessage("category id must be an integer")
];

module.exports = updateArticleMiddleware;
