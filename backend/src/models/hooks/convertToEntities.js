const he = require("he");

const convertToEntities = (result, key) => {
	if (result.changed(key)) {
		const value = result[key];
		if (typeof value === "string") {
			result[key] = he.encode(value);
		}
	}
};

module.exports = convertToEntities;
