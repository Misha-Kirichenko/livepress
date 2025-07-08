const { ARTICLE } = require("@constants/sockets/events");
const { socketRoomUtil } = require("@utils");
const { getArticleInteractionsGateway } = require("@sockets");
const socketStorageService = require("@services/sockets/socketStorageService");

const handleSendReactions = async (
	nickName,
	article_id,
	reactionsData,
	userReaction
) => {
	const articleInteractionsGateway = getArticleInteractionsGateway();
	const roomName = socketRoomUtil.getArticleRoom(article_id);

	const userSockets = socketStorageService.getUserSockets(
		articleInteractionsGateway.name,
		nickName
	);

	articleInteractionsGateway
		.to(roomName)
		.except(userSockets)
		.emit(ARTICLE.REACTION, {
			type: userReaction,
			payload: { article_id, ...reactionsData }
		});
};

module.exports = handleSendReactions;
