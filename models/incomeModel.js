const mongoose = require('mongoose');

const incomeModel = new mongoose.Schema(
	{
		incomeAmount: {
			type: Number,
			default:0,
			required: true,
		},
		currency: {
			type: String,
			enum: ['inr', 'usd', 'yen'],
		},
		description: {
			type: String,
			required: true,
		},
		date: {
			type: Date,
		},
		user: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model('income', incomeModel);
