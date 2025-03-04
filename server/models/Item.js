const mongoose = require('mongoose');
const { Schema } = mongoose;

const itemSchema = new Schema({
	name: {
		type: String,
		required: [true, "Name is a required field"],
		trim: true,
		minLength: 5,
		maxLength: 100,
		lowercase: true
	},
	description: {
		type: String,
		required: [true, "Description is a required field"],
		trim: true,
		minLength: 10,
		maxLength: 500,
		lowercase: true
	},
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true
	}
}, { timestamps: true });

module.exports = mongoose.model('Item', itemSchema);
