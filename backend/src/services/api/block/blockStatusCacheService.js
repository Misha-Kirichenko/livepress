const redis = require("@config/redisClient");
const { createRedisKey } = require("@utils");
const key = createRedisKey("users", "blocked");
/*

Redis hash structure:
	Key: "users:blocked"
	Value format: { [nickName]: blockReason }

Example:
{
   "user123": "Rules violation",
   "user456": "Uncensored comment"
}

*/
exports.simRedisFailure = () => Promise.reject(new Error("Redis offline"));

exports.getBlockReason = async (nickName) => {
	const blockReason = await redis.hget(key, nickName);
	return blockReason;
};

exports.blockUser = async (nickName, reason) => {
	const blockReason = reason || "none";
	await redis.hset(key, nickName, blockReason);
};

exports.unblockUser = async (nickName) => {
	await redis.hdel(key, [nickName]);
};

exports.syncBlockedUsersWithDB = async (usersList) => {
	if (!usersList.length) return;
	const blockedUsers = usersList.reduce((acc, userData) => {
		const plainUserData = userData.get({ plain: true });
		const { nickName, blockReason } = plainUserData;
		acc[nickName] = blockReason || "none";
		return acc;
	}, {});
	await redis.del(key);
	await redis.hset(key, blockedUsers);
};
