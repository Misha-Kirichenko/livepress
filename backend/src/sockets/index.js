let reactionsNamespaceInstance = null;

const reactionsNamespaceHandler = require("./handlers/reactions");

const setupSocketNamespaces = (io) => {
	reactionsNamespaceInstance = io.of("/reactions");
	reactionsNamespaceHandler(reactionsNamespaceInstance);
};

const getReactionsNamespace = () => {
	if (!reactionsNamespaceInstance) {
		throw new Error("Reactions namespace is not initialized");
	}
	return reactionsNamespaceInstance;
};

module.exports = {
	setupSocketNamespaces,
	getReactionsNamespace
};
