require("dotenv").config();
require("module-alias/register");

const conn = require("@config/conn");
const connectDB = require("@config/connectDB");

connectDB(conn);

const usersSeeder = require("./Users")(conn);
const categoriesSeeder = require("./Categories")(conn);
const articlesSeeder = require("./Articles")(conn);
const userCategoriesSeeder = require("./UserCategories")(conn);
const reactionsSeeder = require("./Reactions")(conn);

(async () => {
	try {
		const seeders = [usersSeeder.up(20), categoriesSeeder.up()];
		await Promise.all(seeders);
		await articlesSeeder.up(100);
		await userCategoriesSeeder.up(80);
		await reactionsSeeder.up(400);
	} catch (error) {
		console.error("seeding error:", error);
	}
})();
