const { ARTICLE } = require("@constants/sockets/events");
const { socketRoomUtil } = require("@utils");
const { getArticleInteractionsGateway } = require("@sockets");

const handleSendReactions = async (article_id, reactionsData, userReaction) => {
	const articleInteractionsGateway = getArticleInteractionsGateway();
	const roomName = socketRoomUtil.getArticleRoom(article_id);

	articleInteractionsGateway.to(roomName).emit(ARTICLE.REACTION, {
		type: userReaction,
		payload: { article_id, ...reactionsData }
	});
};

module.exports = handleSendReactions;
