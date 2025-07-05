const { createHttpException } = require("@utils");
const conn = require("@config/conn");
const { MESSAGE_UTIL } = require("@utils");
const { User } = require("@models")(conn);

exports.toggleUserBlock = async (nickName, body) => {
	const { isBlocked, reason } = body;

	const user = await User.findOne({
		where: { nickName }
	});

	if (!user) {
		const notFoundException = createHttpException(
			404,
			MESSAGE_UTIL.ERRORS.NOT_FOUND("User")
		);
		throw notFoundException;
	}

	user.isBlocked = isBlocked;
	user.blockReason = reason || null;
	await user.save();

	const message = `User has been successfully ${
		isBlocked ? "blocked" : "unblocked"
	}`;

	return { message };
};
