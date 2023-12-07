const mongoose = require("mongoose");
require("dotenv").config({path : "/" + "./.env"})

console.log(require('dotenv').config());

mongoose
	.connect('process.env.MONGO_URL')
	.then(() => console.log('Database connected!'))
	.catch(err => console.log(err.message));
