const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { registerValidation, loginValidation } = require("../utils/validate");
const { generateToken } = require("../utils/helpFunction")



// @description: Register Users 
// @route POST /api/v1/user/register
// @access public

const registerUser = async (req, res) => {
	// VALIDATING THE DATA BEFORE WE CREATE A USER
	const { error } = registerValidation(req.body);
	if (error) {
		return res.status(400).json({
			status: "fail",
			error: error.details[0].message,
		});
	}

	const { username, email, password } = req.body;

	try {
		// Check if user already exists
		const userExists = await User.findOne({ email });
		if (userExists) {
			return res.status(400).json({
				status: "fail",
				message: 'User already exists'
			});
		}

		// Hash password
		const hashedPassword = await bcrypt.hash(password, 10);

		// Create user
		const user = await User.create({
			username,
			email,
			password: hashedPassword,
		});

		const { password: _, ...rest } = user._doc; // Exclude password from the response

		res.status(201).json({
			status: "success",
			data: rest,
		});
	} catch (error) {
		res.status(400).json({
			status: "fail",
			error: error.message,
		});
	}
};


// @description: Login Users
// @route POST /api/v1/user/login
// @access public

const loginUser = async (req, res) => {
	// VALIDATING THE DATA BEFORE WE LOGIN A USER
	const { error } = loginValidation(req.body);
	if (error) {
		return res.status(400).json({
			status: "fail",
			error: error.details[0].message,
		});
	}

	const { email, password } = req.body;

	try {
		// Check if user exists
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(401).json({
				status: "fail",
				error: "Account doesn't exist",
			});
		}

		// Check password
		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			return res.status(401).json({
				status: "fail",
				error: "Authentication failed",
			});
		}

		// Generate JWT token
		const token = generateToken(user._id);
		res.header("Authorization", `Bearer ${token}`);

		res.status(200).json({
			status: "success",
			username: user.username,
			message: "User logged in, see Authorization header for token",
		});
	} catch (error) {
		res.status(500).json({
			status: "fail",
			error: error.message
		});
	}
};

module.exports = {
	registerUser,
	loginUser,
};
