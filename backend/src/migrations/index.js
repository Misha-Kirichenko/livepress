require("dotenv").config();
require("module-alias/register");

const conn = require("@config/conn");
const connectDB = require("@config/connectDB");

connectDB(conn);

const usersMigration = require("./Users")(conn);
const categoriesMigration = require("./Categories")(conn);
const userCategoriesMigration = require("./UserCategories")(conn);
const articlesMigration = require("./Articles")(conn);
const reactionsMigration = require("./Reactions")(conn);

(async () => {
	try {
		await usersMigration.up();
		await categoriesMigration.up();
		await userCategoriesMigration.up();
		await articlesMigration.up();
		await reactionsMigration.up();
	} catch (error) {
		console.error("migrations error:", error);
	}
})();
