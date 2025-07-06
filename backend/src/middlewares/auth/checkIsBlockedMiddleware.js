const MESSAGES = require("@constants/messages");
const { statusCodeMessage, createHttpException } = require("@utils");
const {
	blockStatusCacheService,
	blockStatusService
} = require("@services/api/block");

const checkIsBlockedMiddleware = async (req, res, next) => {
	if (req.user && req.user.role === "ADMIN") return next();
	// Attempt to get block status from cache; if it fails, check database instead
	try {
		const blockReason = await blockStatusCacheService.simRedisFailure(
			req.user.nickName
		);

		if (blockReason) {
			const message =
				blockReason === "none"
					? MESSAGES.ERRORS.BLOCKED
					: `${MESSAGES.ERRORS.BLOCKED} for: "${blockReason}"`;

			const forbiddenException = createHttpException(403, message);

			throw forbiddenException;
		}
		return next();
	} catch (error) {
		if (!error.status) {
			console.warn("Failed to get Redis cache:", error.message);
		} else {
			const { status, message } = statusCodeMessage(error);
			if (status === 403) return res.status(status).send({ message });
		}
	}

	try {
		const { isBlocked, blockReason } =
			await blockStatusService.getBlockStatusInfo(req.user.id);

		if (isBlocked) {
			const message = blockReason
				? `${MESSAGES.ERRORS.BLOCKED} for: "${blockReason}"`
				: MESSAGES.ERRORS.BLOCKED;

			const forbiddenException = createHttpException(403, message);
			throw forbiddenException;
		}
		return next();
	} catch (error) {
		const { status, message } = statusCodeMessage(error);
		return res.status(status).send({ message });
	}
};

module.exports = checkIsBlockedMiddleware;
