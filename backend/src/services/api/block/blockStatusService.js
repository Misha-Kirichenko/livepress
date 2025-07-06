const { createHttpException } = require("@utils");
const conn = require("@config/conn");
const MESSAGES = require("@constants/messages");
const { User } = require("@models")(conn);

exports.getBlockStatusInfo = async (id) => {
	const user = await User.findByPk(id, {
		attributes: ["isBlocked", "blockReason"]
	});

	if (!user) {
		const unauthorizedException = createHttpException(
			401,
			MESSAGES.ERRORS.UNAUTHORIZED
		);
		throw unauthorizedException;
	}

	return user;
};
