const allowedOrigins = [
    process.env.FRONTEND_URL,
    process.env.LOCAL_FRONTEND_URL
];


module.exports = {
	origin: function (origin, callback) {
		if (!origin || allowedOrigins.includes(origin)) {
			callback(null, true);
		} else {
			callback(new Error("CORS not allowed"));
		}
	},
	credentials: true
};
