var express = require('express');
var router = express.Router();
const User = require('../models/userModel');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const moment = require('moment');
const path = require('path');
const fs = require('fs');
const uploadOnCloudinary = require('../utils/cloudinary');
const upload = require('../middlewares/multer.middleware');

passport.use(new LocalStrategy(User.authenticate()));
// passport.use(User.createStrategy());

const { sendmail } = require('../utils/sendmail');
const Expense = require('../models/expenseModel');
const Income = require('../models/incomeModel');
const exp = require('constants');

/* --------- isLoggedIn Middleware --------- */
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
		next();
	} else {
		res.redirect('/');
	}
}
/* ---------  Middleware --------- */

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
			// console.log(avatarLocalPath);
			if (!avatarLocalPath) {
				throw new ApiError(400, 'Avatar file is missing');
			}
			const result = await uploadOnCloudinary(avatarLocalPath, onUser);
			// console.log(onUser);
			req.file.filename = result.url;
			onUser.logo = req.file.filename;
			onUser.save().then(function () {
				res.redirect('/profile');
			});
		} catch (error) {
			console.log(error);
		}
	}
);

/*  -------  Login and Signup  ----------------- */
/*  -------  Login and Signup  ----------------- */
router.get('/', function (req, res, next) {
	res.render('index', { admin: req.user, messages: req.flash() });
});
// router.post(
// 	'/signin',
// 	passport.authenticate('local', {
// 		successRedirect: '/dashboard',
// 		// failureRedirect: '/',
// 		// failureFlash: true,
// 		failureMessage: true,
// 	}),
// 	function (req, res, next) {}
// );
router.post('/signin', function (req, res, next) {
	passport.authenticate('local', function (err, user, info) {
		if (err) {
			return next(err);
		}
		if (!user) {
			// Flash an error message to the session
			req.flash('error', 'Invalid Username or Password ! Try again');
			return res.redirect('/');
		}
		req.logIn(user, function (err) {
			if (err) {
				return next(err);
			}
			return res.redirect('/dashboard');
		});
	})(req, res, next);
});
router.post('/signup', async function (req, res, next) {
	try {
		const user = User.register(
			{ username: req.body.username, email: req.body.email },
			req.body.password
		);
		console.log(user);

		req.flash('success', 'Registration Done | Login with Details');
		// if (req.isAuthenticated()) {
		// 	next();
		// } else {
		// 	res.redirect('/');
		// }
		res.redirect('/dashboard');
	} catch (error) {
		if (error.name === 'UserExistsError') {
			// Flash an error message indicating that the user already exists
			req.flash('error', 'User already exists');
			// Redirect back to the signup page
			res.redirect('/');
		} else {
			// If the error is not due to the user already existing, log and send the error
			console.error(error);
			res.send(error);
		}
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
	<h1>User Not Found! <a href="/">Try Again</a></h1>
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

/* ----------- First Main Dashboard */
router.get('/dashboard', isLoggedIn, async function (req, res, next) {
	try {
		const { expenses } = await req.user.populate('expenses');
		const { income } = await req.user.populate('income');
		// console.log(req.user, expenses, income);
		// console.log(expenses);
		// console.log(income);

		res.render('dashboard', {
			admin: req.user,
			expenses,
			income,
			expensesdata: JSON.stringify(expenses),
			incomedata: JSON.stringify(income),
		});
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
		const currentTime = {
			fullDate: moment().format('MMMM MM DD YY'),
			fullMonth: moment().format('MMMM'),
			fullYear: moment().format('YYYY'),
			currDay: moment().format('DD'),
			currMonth: moment().format('MM'),
			currYear: moment().format('YY'),
			wallcal: moment().format('YYYY-MM'),
		};
		// console.log(currentTime);
		res.render('wallet', {
			admin: req.user,
			expenses,
			income,
			currentTime,
			expensesdata: JSON.stringify(expenses),
			incomedata: JSON.stringify(income),
		});
	} catch (error) {
		res.send(error);
	}
});
router.post('/search-calendar', isLoggedIn, async function (req, res, next) {
	try {
		let { expenses } = await req.user.populate('expenses');
		const { income } = await req.user.populate('income');
		const [selYear, selMonth] = await req.body.walletmonth.split('-');
		console.log(`this is year :${selYear} , this month${selMonth}`);
		console.log(selYear);
		console.log(selMonth);
		const currentTime = {
			wallcal: req.body.walletmonth,
		};
		const inpuDat = req.body.walletmonth;
		console.log(inpuDat);
		function getMonthName(monthNumber) {
			const date = new Date(2022, monthNumber - 1, 1); // Subtract 1 as months are zero-based in JavaScript
			const monthName = new Intl.DateTimeFormat('en-US', {
				month: 'short',
			}).format(date);
			return monthName;
		}
		const numericMonth = Number(selMonth); // Replace this with the actual numeric month
		const monthName = getMonthName(numericMonth);

		// Example usage
		console.log(monthName); // Output: March
		console.log(typeof monthName);
		const yearName = String(selYear);
		console.log(yearName);
		console.log(typeof yearName);

		// console.log(req.body.walletmonth);
		// console.log(typeof req.body.walletmonth);

		// console.log(income);
		function findExpensesByDigits(expensesArray, userInpMonth, useInpYear) {
			const matchingExpenses = expensesArray.filter(expense => {
				// console.log(typeof expense.createdAt);
				let createdAtString = expense.createdAt.toString();
				console.log(`originanl ${createdAtString}`);
				console.log(typeof createdAtString);
				const datstring = expense.createdAt.toLocaleDateString();
				console.log(datstring);
				console.log(typeof createdAtString);
				const monthstring = expense.createdAt.getMonth();
				const yearSring = expense.createdAt.getFullYear();
				console.log(`this is mon ${monthstring} and year ${yearSring}`);
				return (createdAtString =
					createdAtString.includes(userInpMonth) ||
					createdAtString.includes(useInpYear));
			});
			return matchingExpenses;
		}

		// Example usage
		// const userInpMonth = ; // Replace this with user input
		const matchingExpenses = findExpensesByDigits(
			expenses,
			monthName,
			yearName
		);
		console.log(matchingExpenses);
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
		let { expenses } = await req.user.populate('expenses');
		let { income } = await req.user.populate('income');

		// console.log(req.user, expenses, income);
		// console.log(expenses);

		res.render('transaction', { admin: req.user, expenses });
	} catch (error) {
		res.send(error);
	}
});

router.get('/search/:key', isLoggedIn, function (req, res, next) {
	console.log(req.params);
	User.findOne({ username: req.session.passport.user })
		.populate({
			populate: 'expenses.user',
			populate: {
				path: 'user',
			},
		})
		.then(function (user) {
			Expense.find({
				$or: [
					{ amount: { $regex: req.params.key } },
					{ remark: { $regex: req.params.key } },
					{ category: { $regex: req.params.key } },
					{ paymentmode: { $regex: req.params.key } },
				],
			})
				.populate('user')
				.then(function (expenses) {
					console.log(expenses);
					res.render('transaction', {
						expenses: expenses,
						admin: req.user,
					});
				});
		});
});

router.get('/profile', isLoggedIn, async function (req, res, next) {
	try {
		let { expenses } = await req.user.populate('expenses');
		let { income } = await req.user.populate('income');

		res.render('profile', { admin: req.user, expenses, income });
	} catch (error) {
		res.send(error);
	}
});
router.post('/profile-update', isLoggedIn, async (req, res, next) => {
	try {
		const updateFields = {};
		if (req.body.firstname) updateFields.firstname = req.body.firstname;
		if (req.body.lastname) updateFields.lastname = req.body.lastname;
		if (req.body.contact) updateFields.contact = req.body.contact;

		const user = await User.findByIdAndUpdate(
			{ _id: req.user.id },
			updateFields,
			{ new: true, runValidators: true }	
		);
		console.log(req.body);
		console.log(user);
		// await user.save();
		req.flash('success', 'Profile updated successfully');
		return res.redirect('back');
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Server error' });
	}
});

router.get('/settings', function (req, res, next) {
	res.render('settings');
});

router.get('/income', isLoggedIn, async function (req, res, next) {
	try {
	} catch (error) {
		res.status(500).json({ error: 'Internal Server Error' });
	}
});

module.exports = router;
