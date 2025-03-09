const fs = require("fs").promises;
const path = require("path");

const deleteFile = async (relativeFilePath) => {
	const absoluteFilePath = path.resolve(relativeFilePath);

	try {
		await fs.unlink(absoluteFilePath);
		// console.log(`File deleted: ${absoluteFilePath}`);
	} catch (error) {
		if (error.code === "ENOENT") {
			console.log(`File not found: ${absoluteFilePath}`);
		} else {
			console.error("Error deleting file:", error);
		}
	}
};

module.exports = { deleteFile };
