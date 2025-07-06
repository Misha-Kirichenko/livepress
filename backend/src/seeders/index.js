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
const commentsSeeder = require("./Comments")(conn);

(async () => {
	try {
		const seeders = [usersSeeder.up(20), categoriesSeeder.up()];
		await Promise.all(seeders);
		await articlesSeeder.up(100);
		await userCategoriesSeeder.up(40);
		await reactionsSeeder.up(1000);
		await commentsSeeder.up(1000);
	} catch (error) {
		if (error.code === "23505") {
			const message = `"${error.table}" seeder tried to insert non-unique value on unique field. Ignoring seeder...`;
			console.warn(message);
			return;
		}
		console.error("other seeding error:", error);
	}
})();
