const mongoose = require("mongoose");
const plm = require("passport-local-mongoose");

const userModel = new mongoose.Schema(
	{
		username: String,
		password: String,
		email: String,
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

module.exports = mongoose.model("user", userModel);
