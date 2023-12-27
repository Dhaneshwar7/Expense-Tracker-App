const mongoose = require("mongoose");
require("dotenv").config({path : "/" + "./.env"})

console.log(require('dotenv').config());

mongoose
	.connect('mongodb://127.0.0.1:27017/ExpenseApp')
	.then(() => console.log('Database connected!'))
	.catch(err => console.log(err.message));
