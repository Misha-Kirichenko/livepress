const { Router } = require("express");
const router = Router();
const { statusCodeMessage, MESSAGE_UTIL } = require("@utils");
const {
	verifyTokenMiddleware,
	checkRolesMiddleware,
	checkIsBlockedMiddleware
} = require("@middlewares/auth");
const { commentService, commentListService } = require("@services/api/comment");

router.get(
	"/:articleId",
	[verifyTokenMiddleware("access"), checkIsBlockedMiddleware],
	async (req, res) => {
		try {
			const answer = await commentListService.getArticleComments(
				req.user.role,
				req.params.articleId,
				req.query
			);
			return res.send(answer);
		} catch (error) {
			console.log("get comments error", error);
			const { status, message } = statusCodeMessage(error);
			return res.status(status).send({ message });
		}
	}
);

router.post(
	"/:articleId",
	[
		verifyTokenMiddleware("access"),
		checkRolesMiddleware(["USER"]),
		checkIsBlockedMiddleware
	],
	async (req, res) => {
		try {
			const answer = await commentService.createArticleComment(
				req.user,
				req.params.articleId,
				req.body.text
			);
			return res.send(answer);
		} catch (error) {
			if (error.name === "SequelizeValidationError") {
				return res.status(422).send({ message: "Comment can't be empty" });
			}
			const { status, message } = statusCodeMessage(error);
			return res.status(status).send({ message });
		}
	}
);

router.patch(
	"/:commentId",
	[
		verifyTokenMiddleware("access"),
		checkRolesMiddleware(["USER"]),
		checkIsBlockedMiddleware
	],
	async (req, res) => {
		try {
			const answer = await commentService.updateArticleComment(
				req.user,
				req.params.commentId,
				req.body.text
			);
			return res.send(answer);
		} catch (error) {
			if (error.name === "SequelizeValidationError") {
				return res.status(422).send({ message: "Comment can't be empty" });
			}
			const { status, message } = statusCodeMessage(error);
			return res.status(status).send({ message });
		}
	}
);

router.delete(
	"/:commentId",
	[verifyTokenMiddleware("access"), checkIsBlockedMiddleware],
	async (req, res) => {
		try {
			const answer = await commentService.deleteArticleComment(
				req.user,
				req.params.commentId
			);
			return res.send(answer);
		} catch (error) {
			const { status, message } = statusCodeMessage(error);
			return res.status(status).send({ message });
		}
	}
);

module.exports = router;
