const mongoose = require('mongoose');
const plm = require('passport-local-mongoose');

const userModel = new mongoose.Schema(
	{
		username: {
			type: String,
			required: true,
			index: { unique: true, sparse: true },
		},
		password: String,
		firstname: {
			type: String,
			// required: [true, 'First Name is Required'],
			minLength: [3, 'Firstname should be atleast of 3 Character'],
		},
		lastname: {
			type: String,
			// required: [true, 'Last Name is Required'],
			minLength: [3, 'Last Name should be atleast of 3 Character'],
		},
		email: {
			type: String,
			required: true,
			index: { unique: true, sparse: true },
			match: [
				/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
				'Please fill a valid email address',
			],
		},
		contact: {
			type: Number,
			maxLength: [10, 'Contact number cannot exceed 10 Numbers'],
			mimLength: [10, 'Contact number cannot exceed 10 Numbers'],
		},
		logo: {
			type: String,
			default: 'https://cdn-icons-png.flaticon.com/512/6596/6596121.png',
		},
		token: {
			type: Number,
			default: -1,
		},
		expenses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'expense' }],
		income: [{ type: mongoose.Schema.Types.ObjectId, ref: 'income' }],
	},
	{ timestamps: true }
);

userModel.plugin(plm);

module.exports = mongoose.model('user', userModel);
