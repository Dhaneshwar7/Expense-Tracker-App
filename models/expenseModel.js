const mongoose = require('mongoose');

const expenseModel = new mongoose.Schema(
	{
		amount: Number,
		remark: String,
		category: String,
		paymentmode: {
			type: String,
			enum: ['Cash', 'Online', 'Card'],
		},
		user: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
	},
	{ timestamps: true }
);

module.exports = mongoose.model('expense', expenseModel);
