const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
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
			[Op.or]: [{ email: login }, { nickName: login }]
		}
	});

	if (foundUser) {
		const passwordsMatch = await bcrypt.compare(password, foundUser.password);
		if (passwordsMatch) {
			if (foundUser.isBlocked) {
				const forbiddenException = createHttpException(
					403,
					MESSAGES.ERRORS.BLOCKED
				);
				throw forbiddenException;
			}
			const tokenPairs = generateTokenPairs({
				id: foundUser.id,
				name: foundUser.name,
				surname: foundUser.surname,
				role: foundUser.role,
				nickName: foundUser.nickName
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
	const { id, name, surname, nickName, role } = userData;
	const foundUser = await User.findByPk(id);

	if (!foundUser) {
		const unauthorizedException = createHttpException(
			401,
			MESSAGES.ERRORS.UNAUTHORIZED
		);
		throw unauthorizedException;
	}

	if (foundUser.isBlocked) {
		const forbiddenException = createHttpException(
			403,
			MESSAGES.ERRORS.BLOCKED
		);
		throw forbiddenException;
	}

	foundUser.lastLogin = Date.now();

	await foundUser.save();

	const tokenPairs = generateTokenPairs({
		id,
		name,
		surname,
		role,
		nickName
	});

	return tokenPairs;
};
