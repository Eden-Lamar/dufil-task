const Item = require('../models/Item');

// @description: Create a new item
// @route POST /api/v1/items
// @access Private
const createItem = async (req, res) => {
	const { name, description } = req.body;

	try {
		const newItem = await Item.create({
			name,
			description,
			user: req.user._id
		});

		res.status(201).json({
			status: "success",
			data: newItem,
		});
	} catch (error) {
		res.status(400).json({
			status: "fail",
			error: error.message,
		});
	}
};

// @description: Get all items
// @route GET /api/v1/items
// @access Private
const getItems = async (req, res) => {
	const { page = 1, search } = req.query; // Get page and search query
	const limit = 10; // Limit to 10 items per page
	const skip = (page - 1) * limit;

	try {
		// Base query to get items for the logged-in user
		let query = { user: req.user._id };

		// Add search condition only if search parameter is provided
		if (search) {
			query.$or = [
				{ name: { $regex: search, $options: "i" } },          // Case-insensitive search on name
				{ description: { $regex: search, $options: "i" } }   // Case-insensitive search on description
			];
		}

		// Get total count for pagination
		const totalItems = await Item.countDocuments(query);

		// Fetch items with pagination and sorting by creation date
		const items = await Item.find(query)
			.sort({ createdAt: -1 }) // Most recent items first
			.skip(skip)
			.limit(limit);

		res.status(200).json({
			totalItems,
			currentPage: Number(page),
			totalPages: Math.ceil(totalItems / limit),
			results: items.length,
			data: items,
		});
	} catch (error) {
		res.status(400).json({
			status: "fail",
			error: error.message,
		});
	}
};

module.exports = {
	createItem,
	getItems,
};