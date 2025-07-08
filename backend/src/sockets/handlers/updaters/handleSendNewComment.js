const { ARTICLE } = require("@constants/sockets/events");
const { socketRoomUtil } = require("@utils");
const { getArticleInteractionsGateway } = require("@sockets");
const socketStorageService = require("@services/sockets/socketStorageService");

const handleSendNewComment = async (article_id, commentData) => {
	const articleInteractionsGateway = getArticleInteractionsGateway();
	const roomName = socketRoomUtil.getArticleRoom(article_id);
	const userSockets = socketStorageService.getUserSockets(
		articleInteractionsGateway.name,
		commentData.author.nickName
	);

	articleInteractionsGateway
		.to(roomName)
		.except(userSockets)
		.emit(ARTICLE.COMMENT_ADD, {
			payload: { article_id, ...commentData }
		});
};

module.exports = handleSendNewComment;
