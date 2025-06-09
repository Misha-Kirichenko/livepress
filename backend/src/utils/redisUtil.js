module.exports = {
	createRedisKey: (keyPrefix, keyValue) => `${keyPrefix}:${keyValue}`
};
