const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
	username: {
		type: String,
		trim: true,
		required: [true, "Username is a Required field"],
		minLength: 3,
		maxLength: 20,
		unique: true
	},
	email: {
		type: String,
		required: [true, "Email is a Required field"],
		trim: true,
		minLength: 6,
		maxLength: 255,
		lowercase: true,
		unique: true,
	},
	password: {
		type: String,
		required: [true, "Password is a Required field"],
		minLength: 8,
		maxLength: 255,
		trim: true,
	}
}, { timestamps: true });



module.exports = mongoose.model('User', userSchema);
