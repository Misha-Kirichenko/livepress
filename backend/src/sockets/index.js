const reactionsNamespace = require("./handlers/reactions");

const setupSocketNamespaces = (io) => {
	reactionsNamespace(io.of("/reactions"));
};

module.exports = { setupSocketNamespaces };
