const authMiddleware = require("../middlewares/authMiddleware");

module.exports = (namespaceInstance) => {
	namespaceInstance.use(authMiddleware);
	namespaceInstance.on("connection", (socket) => {
		socket.on("viewArticle", (articleId) => {
			socket.join(`article:${articleId}`);
		});
	});
};
