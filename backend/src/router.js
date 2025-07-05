const router = require("express").Router();
const {
	authController,
	categoryController,
	articleController,
	notificationController,
	commentController,
	adminController
} = require("./controllers");

router.use("/auth", authController);
router.use("/admin", adminController);
router.use("/categories", categoryController);
router.use("/article", articleController);
router.use("/notifications", notificationController);
router.use("/comments", commentController);

module.exports = router;
