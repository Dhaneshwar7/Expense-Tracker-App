var express = require('express');
var router = express.Router();
const User = require('../models/userModel');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const moment = require('moment');
const path = require('path');
const fs = require('fs');
const uploadOnCloudinary = require('../utils/cloudinary')
const upload = require('../middlewares/multer.middleware');

passport.use(new LocalStrategy(User.authenticate()));
// passport.use(User.createStrategy());

const { sendmail } = require('../utils/sendmail');
const Expense = require('../models/expenseModel');
const Income = require('../models/incomeModel');

router.post(
	'/uploadimg',
	isLoggedIn,
	upload.single('image'),
	async function (req, res, next) {
		try {
			const onUser = await User.findOne({
				username: req.session.passport.user,
			});
			const avatarLocalPath = req.file?.path;
			console.log(avatarLocalPath);
			if (!avatarLocalPath) {
				throw new ApiError(400, 'Avatar file is missing');
			}
			  const result = await uploadOnCloudinary(avatarLocalPath , onUser);
			console.log(onUser);
			req.file.filename = result.url;
			onUser.logo = req.file.filename;
			onUser.save().then(function () {
				res.redirect('back');
			});
		} catch (error) {
			console.log(error);
		}
	}
);

/*  -------  Login and Signup  ----------------- */
/*  -------  Login and Signup  ----------------- */
router.get('/', function (req, res, next) {
	res.render('index', { admin: req.user });
});
router.post(
	'/signin',
	passport.authenticate('local', {
		successRedirect: '/dashboard',
		failureRedirect: '/',
	}),
	function (req, res, next) {}
);
router.post('/signup', async function (req, res, next) {
	try {
		await User.register(
			{ username: req.body.username, email: req.body.email },
			req.body.password
		);
		res.redirect('/');
	} catch (error) {
		console.log(error);
		res.send(error);
	}
});

/*  ----------------  Forget Route  & Send Mail ----------------- */
router.get('/forget', function (req, res, next) {
	res.render('forgetmail');
});

router.post('/send-mail', async function (req, res, next) {
	try {
		const user = await User.findOne({ email: req.body.email });
		if (!user)
			return res.send(`<div

	style="
	overflow: hidden;
	font-size:3vw;
		width: 100vw;
		height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
	"
>
	<h1>User Not Found! <a href="/forget">Try Again</a></h1>
</div>`);

		sendmail(user.email, user, res, req);
	} catch (error) {
		console.log(error);
		res.send(error);
	}
});
router.post('/forget/:id', async function (req, res, next) {
	try {
		const user = await User.findById(req.params.id);
		if (!user)
			return res.send("User not found! <a href='/forget'>Try Again</a>.");

		if (user.token == req.body.token) {
			user.token = -1;
			await user.setPassword(req.body.newpassword);
			await user.save();
			res.redirect('/');
		} else {
			user.token = -1;
			await user.save();
			res.send("Invalid Token! <a href='/forget'>Try Again<a/>");
		}
	} catch (error) {
		res.send(error);
	}
});
/*  ----------------  Forget Route  & Send Mail ----------------- */

/* --------- Reset Password  --------- */
router.get('/reset', isLoggedIn, function (req, res, next) {
	res.render('reset', { admin: req.user });
});
router.post('/reset', isLoggedIn, async function (req, res, next) {
	try {
		await req.user.changePassword(req.body.oldpassword, req.body.newpassword);
		await req.user.save();
		res.redirect('/dashboard');
	} catch (error) {
		res.send(error);
	}
});
/* --------- Reset Password  --------- */

/* --------- Signout User  --------- */
router.get('/signout', isLoggedIn, function (req, res, next) {
	req.logout(() => {
		res.redirect('/');
	});
});
/* --------- Signout User  --------- */

/* --------- isLoggedIn Middleware --------- */
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
		next();
	} else {
		res.redirect('/');
	}
}
/* --------- isLoggedIn Middleware --------- */

/* ----------- First Main Dashboard */
router.get('/dashboard', isLoggedIn, async function (req, res, next) {
	try {
		const { expenses } = await req.user.populate('expenses');
		const { income } = await req.user.populate('income');
		// console.log(req.user, expenses, income);

		res.render('dashboard', { admin: req.user, expenses, income });
	} catch (error) {
		res.send(error);
	}
});
/* --------------- Add Expense -------------- */
router.post('/addexpense', isLoggedIn, async function (req, res, next) {
	try {
		const expense = new Expense(req.body);
		backURL = req.header('Referer') || '/';
		req.user.expenses.push(expense._id);
		expense.user = req.user._id;
		await req.user.save();
		await expense.save();
		res.redirect('/dashboard');
	} catch (error) {
		console.log(error);
	}
});
router.post('/addincome', isLoggedIn, async function (req, res, next) {
	try {
		const incomeAdd = new Income(req.body);
		req.user.income.push(incomeAdd._id);
		incomeAdd.user = req.user._id;
		await req.user.save();
		await incomeAdd.save();
		res.redirect('/dashboard');
	} catch (error) {
		console.log(error);
	}
});

/* --------------- Other Pages -------------- */
router.get('/wallet', isLoggedIn, async function (req, res, next) {
	try {
		const { expenses } = await req.user.populate('expenses');
		const { income } = await req.user.populate('income');
		console.log(req.user, expenses, income);
		const currentTime = {
			fullDate: moment().format('MMMM MM DD YY'),
			fullMonth: moment().format('MMMM'),
			fullYear: moment().format('YYYY'),
			currDay: moment().format('DD'),
			currMonth: moment().format('MM'),
			currYear: moment().format('YY'),
			wallcal: moment().format('YYYY-MM'),
		};
		console.log(currentTime);
		res.render('wallet', {
			admin: req.user,
			expenses,
			income,
			currentTime,
		});
	} catch (error) {
		res.send(error);
	}
});
router.post('/search-calendar', isLoggedIn, async function (req, res, next) {
	try {
		const { expenses } = await req.user.populate('expenses');
		const { income } = await req.user.populate('income');
		const currentTime = {
			wallcal: req.body.walletmonth,
		};
		const [selYear, selMonth] = req.body.walletmonth.split('-');
		console.log(income);
		res.render('wallet', {
			admin: req.user,
			expenses,
			income,
			currentTime,
		});
	} catch (error) {
		res.send(error);
	}
});

router.get('/transaction', isLoggedIn, async function (req, res, next) {
	try {
		const { expenses } = await req.user.populate('expenses');
		const { income } = await req.user.populate('income');
		console.log(req.user, expenses, income);

		res.render('transaction', { admin: req.user, expenses, income });
	} catch (error) {
		res.send(error);
	}
});
router.get('/profile', isLoggedIn, function (req, res, next) {
	res.render('profile');
});

router.get('/settings', function (req, res, next) {
	res.render('settings');
});

// router.post('/uploadpic', upload.single('avatar'), async function(req,res,next) {
// 	try {
// 		if (req.file.path) return null;
// 		// upload the on the Cloudinary
// 		console.log(req.file.path);
// 		const response = await cloudinary.uploader.upload(req.file.path, {
// 			resource_type: 'image',
// 		});
// 		// file has been uploaded Successfully
// 		console.log('file upload Successfully', response.url);
// 		return response;
// 	} catch (error) {
// 		//REmover the Locally saved temporary file as the upload operation got failed
// 		return null;
// 	}
// });

module.exports = router;
