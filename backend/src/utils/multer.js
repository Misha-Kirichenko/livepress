const multer = require("multer");
const path = require("path");
const fs = require("fs");

const createMulterInstance = (folder) => {
	const storage = multer.diskStorage({
		destination: (req, file, cb) => {
			const uploadPath = path.resolve("user_uploads", folder);
			fs.mkdirSync(uploadPath, { recursive: true });
			cb(null, uploadPath);
		},
		filename: (req, file, cb) => {
			const uniqueSuffix = Date.now();
			cb(null, uniqueSuffix + path.extname(file.originalname));
		}
	});

	return multer({
		storage,
		limits: { fileSize: 5 * 1024 * 1024 },
		fileFilter: (req, file, cb) => {
			const fileTypes = /jpeg|jpg|png|gif/;
			const extname = fileTypes.test(
				path.extname(file.originalname).toLowerCase()
			);
			const mimetype = fileTypes.test(file.mimetype);

			if (extname && mimetype) {
				return cb(null, true);
			} else {
				return cb(
					new Error("Only next extensions are allowed: jpeg, jpg, png, gif")
				);
			}
		}
	});
};

module.exports = createMulterInstance;
