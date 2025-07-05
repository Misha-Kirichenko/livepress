const { MESSAGE_UTIL } = require("@utils");
const { body } = require("express-validator");

const blockUserMiddleware = [
	body("isBlocked")
		.exists()
		.withMessage(MESSAGE_UTIL.ERRORS.REQUIRED("isBlocked"))
		.isBoolean({ strict: true })
		.withMessage("isBlocked must be a boolean"),

	body("reason").custom((value, { req }) => {
		const { isBlocked } = req.body;

		if (!isBlocked) {
			if (value !== undefined && value !== null && value !== "") {
				throw new Error("Reason should not be provided while unblocking user");
			}
		}

		if (isBlocked) {
			if (typeof value === "string" && !value.trim())
				throw new Error(`"If reason is present it should not be empty"`);
			if (value && typeof value !== "string")
				throw new Error("Reason must be a string while blocking user");
			if (value && value.length < 10) {
				throw new Error("Reason must be at least 10 characters long");
			}
		}

		return true;
	})
];

module.exports = blockUserMiddleware;
