function desktopMenuClickBtn() {
	$(document).ready(function () {
		let flag = 0;
		$('.close-menu').click(function () {
			console.log('ljfj');
			if (flag === 0) {
				$('.close-menu').addClass('open');
				$('.right-container').css('width', '10%');
				$('.center-container').css('width', '75%');
				flag = 1;
			} else {
				$('.close-menu').removeClass('open');
				$('.right-container').css('width', '25%');
				$('.center-container').css('width', '60%');
				flag = 0;
			}
		});
	});
}
function mobileMenuClickBtn() {
	$(document).ready(function () {
		let flag = 0;
		$('.close-menu').click(function () {
			console.log('ljfj');
			if (flag === 0) {
				$('.close-menu').addClass('open');
				$('.profile-container').css('display', 'flex');
				$('.profile-container').css('height', '500px');
				// $('.right-container').css('width', '10%');
				// $('.center-container').css('width', '75%');
				flag = 1;
			} else {
				$('.close-menu').removeClass('open');
				$('.profile-container').css('display', 'none');
				$('.profile-container').css('height', '0px');
				// $('.right-container').css('width', '25%');
				// $('.center-container').css('width', '60%');
				flag = 0;
			}
		});
	});
}

function dyanamicResponsive() {
	var widthh = window.innerWidth;
	window.addEventListener('resize', function () {
		if (window.innerWidth !== widthh) {
			window.location.reload(true);
		}
	});
	console.log(widthh);

	if (widthh >= 0 && widthh <= 375) {
		// Code to execute when yourValue is between 0 and 400
		console.log('/* Media Query for low resolution Mobile Devices */');
		console.log('yeee ahi');
		mobileMenuClickBtn();
	} else if (widthh >= 376 && widthh <= 600) {
		// Code to execute when yourValue is between 401 and 600
		console.log('/* Media Query for Mobile Devices */');
		mobileMenuClickBtn();
	} else if (widthh >= 601 && widthh <= 767) {
		/* Media Query for low resolution  Tablets, Ipads */
		console.log('Media Query for low resolution  Tablets, Ipads');
	} else if (widthh >= 768 && widthh <= 1023) {
		/* Media Query for Tablets Ipads portrait mode */
		console.log('Media Query for Tablets Ipads portrait mode ');
		desktopMenuClickBtn();
	} else if (widthh >= 1024 && widthh <= 1500) {
		console.log(' /* Media Query for Tab LandScape */');
		console.log('ye 1024 se upar');
		desktopMenuClickBtn();
	}
}

dyanamicResponsive();

// ---------------- Experiment Code ----------

var navList = document.querySelectorAll('.nav-ul li');
console.log(navList);

navList.forEach(function (ekl) {
	console.log(ekl);
	ekl.addEventListener('click', () => {
		console.log(ekl.children);
	});
});

const currentUrl = window.location.href;
console.log(currentUrl);

// document.querySelectorAll(".close-menu").addEventListener("click" , ()=>{

// })
