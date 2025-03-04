const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/User");

const protect = async (req, res, next) => {
	const token = req.header("Authorization")?.split(" ")[1];

	if (!token) {
		return res.status(401).json({
			status: "fail",
			error: "Unauthorized. No token provided."
		});
	}

	try {
		const userId = jwt.verify(token, process.env.JWT_SECRET);
		// Attach user to request object
		req.user = await User.findById(userId.id).select("-password");

		if (!req.user) {
			return res.status(404).json({ status: "fail", error: "User not found" });
		}

		next();
	} catch (error) {
		if (error.name === "TokenExpiredError") {
			return res.status(401).json({
				status: "fail",
				error: "Token has expired. Please log in again."
			});
		} else if (error.name === "JsonWebTokenError") {
			return res.status(401).json({
				status: "fail",
				error: "Invalid token. Please log in or provide a valid token."
			});
		} else {
			return res.status(500).json({
				status: "fail",
				error: "Something went wrong. Check your internet connection."
			});
		}
	}
};

module.exports = { protect };
