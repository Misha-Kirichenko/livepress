const faker = require("faker");
const bcrypt = require("bcrypt");

module.exports = (conn) => {
	const queryInterface = conn.getQueryInterface();
	return {
		up: async (amount) => {
			const [[result]] = await queryInterface.sequelize.query(
				"SELECT COUNT(id) FROM users;"
			);
			const { count: total } = result;

			if (total < amount) {
				const usersToSeed = Math.abs(amount - total);
				const users = [...Array(usersToSeed)].map(() => {
					const name = faker.name.firstName().replace(/'/g, "&#39;");
					const surname = faker.name.lastName().replace(/'/g, "&#39;");
					const lastLogin = faker.time.recent("unix");
					const nickName = faker.internet
						.userName(name, surname)
						.toLowerCase()
						.replace(/'/g, "");

					return {
						name,
						surname,
						email: faker.internet.email(name, surname).toLowerCase(),
						password: bcrypt.hashSync(
							"password123",
							parseInt(process.env.PASSWORD_SALT_ROUNDS)
						),
						nickName,
						role: "USER",
						lastLogin
					};
				});

				const admins = [
					{
						name: "John",
						surname: "Doe",
						email: "johndoe@gmail.com",
						lastLogin: faker.time.recent("unix"),
						password: bcrypt.hashSync(
							"adminPassword123",
							parseInt(process.env.PASSWORD_SALT_ROUNDS)
						),
						role: "ADMIN",
						nickName: "johndoe1"
					},
					{
						name: "Jane",
						surname: "Doe",
						email: "janedoe@gmail.com",
						lastLogin: faker.time.recent("unix"),
						password: bcrypt.hashSync(
							"adminPassword123",
							parseInt(process.env.PASSWORD_SALT_ROUNDS)
						),
						role: "ADMIN",
						nickName: "janedoe1"
					}
				];

				console.log("Executing users seeder...");

				const values = [...users, ...admins]
					.map(
						({ name, surname, email, password, role, nickName, lastLogin }) =>
							`('${name}', '${surname}', '${email}', '${password}', '${role}', '${nickName}','${lastLogin}')`
					)
					.join(",");

				await queryInterface.sequelize.query(`
					INSERT INTO users (name, surname, email, password, role, "nickName", "lastLogin")
					VALUES ${values}
					ON CONFLICT (email) DO NOTHING;
				`);

				console.log("users seeder executed successfully.");
			}
		},
		down: () => {
			return queryInterface.bulkDelete("users", null, {});
		}
	};
};
