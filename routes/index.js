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

// -----
// router.get('/wallet', isLoggedIn, async function (req, res, next) {
// 	try {
// 		const { expenses } = await req.user.populate('expenses');

// 		const { income } = await req.user.populate('income');

// 		const currentTime = {
// 			fullDate: moment().format('MMMM MM DD YY'),
// 			fullMonth: moment().format('MMMM'),
// 			fullYear: moment().format('YYYY'),
// 			currDay: moment().format('DD'),
// 			currMonth: moment().format('MM'),
// 			currYear: moment().format('YY'),
// 			wallcal: moment().format('YYYY-MM'),
// 		};
// 		res.send(monthTotal);
// 		res.render('wallet', {
// 			admin: req.user,
// 			expenses,
// 			income,
// 			currentTime,
// 			expensesdata: JSON.stringify(expenses),
// 			incomedata: JSON.stringify(income),
// 		});
// 	} catch (error) {
// 		res.send(error);
// 	}
// });

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
		const currentDate = new Date();

		// Format the current date as YYYY-MM (required by the input type="month")
		const currentYear = currentDate.getFullYear();
		const currentMonth = (currentDate.getMonth() + 1)
			.toString()
			.padStart(2, '0');
		const currentMonthYear = `${currentYear}-${currentMonth}`;

		// console.log(currentTime);
		console.log(typeof expenses);
		const sortedData = expenses.sort((a, b) => b.amount - a.amount);
		console.log(`this is so ${sortedData}`);

		const sData = expenses.sort((a, b) => a.category.localeCompare(b.category));
		console.log(sData);

		// Step 2: Calculate the total amount for each category and store in variables
		let transportationTotal = 0;
		let foodTotal = 0;

		sData.forEach(obj => {
			if (obj.category === 'Transportation') {
				transportationTotal += obj.amount;
			} else if (obj.category === 'Food') {
				foodTotal += obj.amount;
			}
		});

		// Display the total amount for each category
		console.log('Transportation Total:', transportationTotal);
		console.log('Food Total:', foodTotal);

		res.render('wallet', {
			admin: req.user,
			expenses,
			income,
			currentTime,
			currentMonthYear,
			expensesdata: JSON.stringify(expenses),
			incomedata: JSON.stringify(income),
		});
	} catch (error) {
		res.send(error);
	}
});

router.get('/search-calendar', isLoggedIn, async (req, res, next) => {
	try {
		const { income } = await req.user.populate('income');
		const { expenses } = await req.user.populate('expenses');

		// Check if walletmonth is provided and in the correct format
		const walletMonth = req.query.walletmonth;
		if (!walletMonth || !walletMonth.includes('-')) {
			return res
				.status(400)
				.json({ error: 'Invalid or missing walletmonth parameter' });
		}
		console.log(walletMonth);

		// Extract year and month from the walletmonth parameter
		const [selYear, selMonth] = walletMonth.split('-');
		const yearInt = parseInt(selYear);
		const monthInt = parseInt(selMonth);
		console.log(yearInt);
		console.log(monthInt);
		const currentMonthYear = `${selYear}-${selMonth}`;

		// Validate year and month
		if (isNaN(yearInt) || isNaN(monthInt)) {
			return res.status(400).json({ error: 'Invalid year or month' });
		}

		const expenseTotal = await Expense.aggregate([
			{
				$match: {
					user: req.user._id,
					$expr: {
						$and: [
							{ $eq: [{ $year: '$createdAt' }, yearInt] },
							{ $eq: [{ $month: '$createdAt' }, monthInt] },
						],
					},
				},
			},
			// ---second option---
			{
				$group: {
					_id: null,
					totalExpenseOfMonth: { $sum: '$amount' }, // Sum the Amount
				},
			},
			{
				$project: {
					totalExpenseOfMonth: { $ifNull: ['$totalExpenseOfMonth', 0] },
				},
			},
		]);

		// Perform aggregation to calculate total income for the specified month and year
		const incomeTotal = await Income.aggregate([
			{
				$match: {
					user: req.user._id,
					$expr: {
						$and: [
							{ $eq: [{ $year: '$createdAt' }, yearInt] },
							{ $eq: [{ $month: '$createdAt' }, monthInt] },
						],
					},
				},
			},
			// ---second option---
			{
				$group: {
					_id: null,
					totalIncomeMonthAmount: { $sum: '$incomeAmount' }, // Sum the incomeAmount
				},
			},
			// ----
			// {
			// 	$group: {
			// 		_id: { month: '$createdAt', description: '$description' },
			// 		totalIncomeMonthAmount: { $sum: '$incomeAmount' },
			// 	},
			// },
			{
				$project: {
					totalIncomeMonthAmount: { $ifNull: ['$totalIncomeMonthAmount', 0] },
				},
			},
		]);
		const currentTime = {
			fullDate: moment().format('MMMM MM DD YY'),
			fullMonth: moment().format('MMMM'),
			fullYear: moment().format('YYYY'),
			currDay: moment().format('DD'),
			currMonth: moment().format('MM'),
			currYear: moment().format('YY'),
			wallcal: moment().format('YYYY-MM'),
		};
		const totalExpense =
			expenseTotal.length > 0 ? expenseTotal[0].totalExpenseOfMonth : 0;
		const totalIncome =
			incomeTotal.length > 0 ? incomeTotal[0].totalIncomeMonthAmount : 0;
		let savingTotal = totalIncome - totalExpense;
		console.log(totalExpense, totalIncome, savingTotal);

		res.render('walletcalendar', {
			admin: req.user,
			expenses,
			income,
			currentTime,
			totalExpense,
			totalIncome,
			savingTotal,
			currentMonthYear,
			expensesdata: JSON.stringify(expenses),
			incomedata: JSON.stringify(income),
		});
	} catch (error) {
		res.status(500).json({ error: 'Internal Server Error' });
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
