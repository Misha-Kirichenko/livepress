const router = require("express").Router();
const {
	authController,
	categoryController,
	articleController,
	notificationController
} = require("./controllers");

router.use("/auth", authController);
router.use("/categories", categoryController);
router.use("/article", articleController);
router.use("/notifications", notificationController);

module.exports = router;
