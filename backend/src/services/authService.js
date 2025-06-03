const bcrypt = require("bcrypt");
const { createHttpException, generateTokenPairs } = require("@utils");
const conn = require("@config/conn");
const { User } = require("@models")(conn);
const MESSAGES = require("@constants/messages");

exports.login = async (login, password) => {
	if (!login || !password) {
		const badRequestException = createHttpException(
			400,
			MESSAGES.ERRORS.ALL_FIELDS_REQUIRED
		);
		throw badRequestException;
	}

	const foundUser = await User.scope("withPassword").findOne({
		where: {
			email: login
		}
	});

	if (foundUser) {
		const passwordsMatch = await bcrypt.compare(password, foundUser.password);
		if (passwordsMatch) {
			const tokenPairs = generateTokenPairs({
				id: foundUser.id,
				name: foundUser.name,
				surname: foundUser.surname,
				role: foundUser.role
			});

			foundUser.lastLogin = Date.now();

			await foundUser.save();
			return tokenPairs;
		}
	}

	const unauthorizedException = createHttpException(
		401,
		MESSAGES.ERRORS.UNAUTHORIZED
	);
	throw unauthorizedException;
};

exports.refresh = async (userData) => {
	const { id, name, surname, role } = userData;
	const foundUser = await User.findByPk(id);

	if (!foundUser) {
		const unauthorizedException = createHttpException(
			401,
			MESSAGES.ERRORS.UNAUTHORIZED
		);
		throw unauthorizedException;
	}

	foundUser.lastLogin = Date.now();

	await foundUser.save();

	const tokenPairs = generateTokenPairs({
		id,
		name,
		surname,
		role
	});

	return tokenPairs;
};
