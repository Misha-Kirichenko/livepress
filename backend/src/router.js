const router = require("express").Router();
const {
	authController,
	categoryController,
	articleController
} = require("./controllers");

router.use("/auth", authController);
router.use("/categories", categoryController);
router.use("/article", articleController);

module.exports = router;
