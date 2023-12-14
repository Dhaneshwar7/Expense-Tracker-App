const mongoose = require('mongoose');

const incomeModel = new mongoose.Schema(
	{
		incomeAmount: {
			type: Number,
			required: true,
		},
		incomeMonth: { 
			type: String,
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
			required: true,
		},
		user: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model('income', incomeModel);
