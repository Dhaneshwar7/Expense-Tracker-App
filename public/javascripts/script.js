function bigScreens() {
	const signUpButton = document.getElementById('signUp');
	const signInButton = document.getElementById('signIn');
	const container = document.getElementById('container');
	signUpButton.addEventListener('click', () => {
		// console.log('ndjf');
		container.classList.add('right-panel-active');
	});
	signInButton.addEventListener('click', () => {
		container.classList.remove('right-panel-active');
	});
	// setTimeout(() => {
	// 	document.querySelector('.reg-error').style.display = 'none';
	// }, 3500);
}

function mobileScreens() {
	const signUpButton = document.getElementById('signUp');
	const signInButton = document.getElementById('signIn');
	const container = document.getElementById('container');
	signUpButton.addEventListener('click', () => {
		container.classList.add('mobile-right-panel-active');
	});
	signInButton.addEventListener('click', () => {
		container.classList.remove('mobile-right-panel-active');
	});
}

function dyanamicResponsive() {
	var widthh = window.innerWidth;
	window.addEventListener('resize', function () {
		if (window.innerWidth !== widthh) {
			window.location.reload(true);
		}
	});
	// console.log(widthh);

	if (widthh >= 0 && widthh <= 375) {
		// Code to execute when yourValue is between 0 and 400
		// console.log('/* Media Query for low resolution Mobile Devices */');
		mobileScreens();
		// console.log('yeee ahi');
	} else if (widthh >= 376 && widthh <= 600) {
		mobileScreens();
		// Code to execute when yourValue is between 401 and 600
		// console.log('/* Media Query for Mobile Devices */');
	} else if (widthh >= 601 && widthh <= 767) {
		/* Media Query for low resolution  Tablets, Ipads */
		// console.log('Media Query for low resolution  Tablets, Ipads');
	} else if (widthh >= 768 && widthh <= 1023) {
		/* Media Query for Tablets Ipads portrait mode */
		// console.log('Media Query for Tablets Ipads portrait mode ');
	} else if (widthh >= 1024 && widthh <= 1500) {
		// console.log(' /* Media Query for Tab LandScape */');
		// console.log('ye 1024 se upar');
		bigScreens();
	}
}

dyanamicResponsive();

document.addEventListener('focusin', function (event) {
	if (event.target.tagName === 'INPUT') {
		document.body.scrollTop = 0;
	}
});

// const currentUrl = window.location.href;
// console.log(currentUrl);
