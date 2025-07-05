const { Router } = require("express");
const router = Router();
const { statusCodeMessage, MESSAGE_UTIL } = require("@utils");
const {
	verifyTokenMiddleware,
	checkRolesMiddleware
} = require("@middlewares/auth");
const commentService = require("@services/commentService");

router.get(
	"/:articleId",
	[verifyTokenMiddleware("access")],
	async (req, res) => {
		try {
			const answer = await commentService.getArticleComments(
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
	[verifyTokenMiddleware("access"), checkRolesMiddleware(["USER"])],
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
			if (error.name === "SequelizeForeignKeyConstraintError") {
				return res
					.status(404)
					.send({ message: MESSAGE_UTIL.ERRORS.NOT_FOUND("Article") });
			}
			const { status, message } = statusCodeMessage(error);
			return res.status(status).send({ message });
		}
	}
);

router.patch(
	"/:commentId",
	[verifyTokenMiddleware("access"), checkRolesMiddleware(["USER"])],
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
	[verifyTokenMiddleware("access")],
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
