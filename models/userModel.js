const mongoose = require("mongoose");
const plm = require("passport-local-mongoose");

const userModel = new mongoose.Schema(
    {
        username: String,
        password: String,
        email: String,
        token: {
            type: Number,
            default: -1,
        },
        expenses: [{ type: mongoose.Schema.Types.ObjectId, ref: "expense" }],
    },
    { timestamps: true }
);

userModel.plugin(plm);
// userModel.plugin(plm, { usernameField: "email" });

module.exports = mongoose.model("user", userModel);
