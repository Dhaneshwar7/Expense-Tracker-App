var express = require('express');
var router = express.Router();
const User = require('../models/userModel');
const passport = require('passport');
const LocalStrategy = require('passport-local');

passport.use(new LocalStrategy(User.authenticate()));
// passport.use(User.createStrategy());

const { sendmail } = require('../utils/sendmail');
const Expense = require('../models/expenseModel');

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
		console.log(req.user, expenses);
		res.render('dashboard', { admin: req.user, expenses });
	} catch (error) {
		res.send(error);
	}
});
/* --------------- Other Pages -------------- */
router.get('/wallet', function (req, res, next) {
	res.render('wallet');
});

router.get('/transaction', function (req, res, next) {
	res.render('transaction');
});
router.get('/profile', function (req, res, next) {
	res.render('profile');
});


router.get('/settings', function (req, res, next) {
	res.render('settings');
});

module.exports = router;
