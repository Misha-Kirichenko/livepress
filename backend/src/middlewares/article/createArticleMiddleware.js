const { MESSAGE_UTIL } = require("@utils");
const { body } = require("express-validator");

const createArticleMiddleware = [
	body("title")
		.trim()
		.escape()
		.notEmpty()
		.withMessage(MESSAGE_UTIL.ERRORS.REQUIRED("title"))
		.bail()
		.custom((value) => {
			if (!isNaN(value)) {
				throw new Error("title must be a string");
			}
			return true;
		})
		.isString()
		.withMessage("title must be a string")
		.bail()
		.isLength({ max: 255 })
		.withMessage("title maximum length must be equal or less than 255"),

	body("description")
		.trim()
		.escape()
		.notEmpty()
		.withMessage(MESSAGE_UTIL.ERRORS.REQUIRED("description"))
		.bail()
		.custom((value) => {
			if (!isNaN(value)) {
				throw new Error("title must be a string");
			}
			return true;
		})
		.isString()
		.withMessage("description must be a string"),

	body("category_id")
		.notEmpty()
		.withMessage("category_id is required")
		.bail()
		.isInt({ min: 1 })
		.withMessage("category id must be integer")
];

module.exports = createArticleMiddleware;
