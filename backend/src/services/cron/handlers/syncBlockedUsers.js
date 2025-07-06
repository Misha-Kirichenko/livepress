const conn = require("@config/conn");
const { User } = require("@models")(conn);
const { blockStatusCacheService } = require("@services/api/block");

const syncBlockedUsers = async (context) => {
	const blockedUsers = await User.findAll({
		where: { role: "USER", isBlocked: true },
		attributes: ["nickName", "blockReason"]
	});
	await blockStatusCacheService.syncBlockedUsersWithDB(blockedUsers);
	console.log(`Running "syncBlockedUsers" cron task at`, context.date);
};

module.exports = syncBlockedUsers;
