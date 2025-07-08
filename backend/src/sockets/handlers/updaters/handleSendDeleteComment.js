const { ARTICLE } = require("@constants/sockets/events");
const { socketRoomUtil } = require("@utils");
const { getArticleInteractionsGateway } = require("@sockets");
const socketStorageService = require("@services/sockets/socketStorageService");

const handleSendDeleteComment = async (article_id, id, nickName) => {
	const articleInteractionsGateway = getArticleInteractionsGateway();
	const roomName = socketRoomUtil.getArticleRoom(article_id);
	const userSockets = socketStorageService.getUserSockets(
		articleInteractionsGateway.name,
		nickName
	);

	articleInteractionsGateway
		.to(roomName)
		.except(userSockets)
		.emit(ARTICLE.COMMENT_DELETE, {
			payload: { article_id, id }
		});
};

module.exports = handleSendDeleteComment;
