const namespaces = require("@constants/sockets/namespaces");

const storage = new Map();

/*
example structure
{
	"/articleInteractions": {<nickName>: <socketId>[]}
	...
}

*/
for (const key in namespaces) {
	storage.set(namespaces[key], new Map());
}

exports.addNewUserSocket = (namespace, nickName, socketId) => {
	const namespaceMap = storage.get(namespace);
	const userSet = namespaceMap.get(nickName);
	if (userSet) {
		userSet.add(socketId);
		return;
	}
	namespaceMap.set(nickName, new Set());
	namespaceMap.get(nickName).add(socketId);
};

exports.getUserSockets = (namespace, nickName) => {
	const namespaceMap = storage.get(namespace);
	const userSet = namespaceMap.get(nickName);
	return userSet ? Array.from(userSet) : [];
};

exports.removeUserSocket = (namespace, nickName, socketId) => {
	const namespaceMap = storage.get(namespace);
	const userSet = namespaceMap.get(nickName);
	if (userSet && userSet.size === 1) namespaceMap.delete(nickName);
	else userSet?.delete(socketId);
};

exports.removeUser = (namespace, nickName) => {
	const namespaceMap = storage.get(namespace);
	namespaceMap.delete(nickName);
};
