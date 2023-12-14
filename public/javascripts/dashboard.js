// ---------------- Responsive Code ----------
function desktopMenuClickBtn() {
	$(document).ready(function () {
		let flag = 0;
		$('.close-menu').click(function () {
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
	// console.log(widthh);

	if (widthh >= 0 && widthh <= 375) {
		// Code to execute when yourValue is between 0 and 400
		// console.log('/* Media Query for low resolution Mobile Devices */');
		// console.log('yeee ahi');
		mobileMenuClickBtn();
	} else if (widthh >= 376 && widthh <= 600) {
		// Code to execute when yourValue is between 401 and 600
		// console.log('/* Media Query for Mobile Devices */');
		mobileMenuClickBtn();
	} else if (widthh >= 601 && widthh <= 767) {
		/* Media Query for low resolution  Tablets, Ipads */
		// console.log('Media Query for low resolution  Tablets, Ipads');
	} else if (widthh >= 768 && widthh <= 1023) {
		/* Media Query for Tablets Ipads portrait mode */
		// console.log('Media Query for Tablets Ipads portrait mode ');
		desktopMenuClickBtn();
	} else if (widthh >= 1024 && widthh <= 1500) {
		// console.log(' /* Media Query for Tab LandScape */');
		// console.log('ye 1024 se upar');
		desktopMenuClickBtn();
	}
}
dyanamicResponsive();
DarkLightMode();
headOverlayOpenClose();


/*----Server Data Collect usign Template and store into in Array now ----*/
const importContentFromEjs = document.querySelectorAll(
	'[data-search-show-rec]'
);
const importExpTemplate = document.querySelectorAll('[data-expense-rec]');
let newCollectDataArray = [];
importExpTemplate.forEach(elem => {
	const ekCard = elem.content.cloneNode(true).children[0];
	// console.log(ekCard);
	// console.log(elem);
	const newexpAmount = ekCard
		.querySelector('[data-amount-rec]')
		.textContent.toLowerCase();
	const newexpCategory = ekCard
		.querySelector('[data-category-rec]')
		.textContent.toLowerCase();
	const newexpPaymentMode = ekCard
		.querySelector('[data-paymentMode-rec]')
		.textContent.toLowerCase();
	const newexpRemark = ekCard
		.querySelector('[data-remark-rec]')
		.innerText.toLowerCase();
	const newexpUser = ekCard
		.querySelector('[data-user-rec]')
		.textContent.toLowerCase();
	const newexpId = ekCard
		.querySelector('[data-id-rec]')
		.textContent.toLowerCase();
	const newexpDate = ekCard
		.querySelector('[data-date-rec]')
		.textContent.toLowerCase();
	let newCollectedDatafromEjs = {
		eAmount: Number(newexpAmount.trim()),
		eCategory: String(newexpCategory.trim()),
		ePaymenMode: String(newexpPaymentMode.trim()),
		eRemark: String(newexpRemark.trim()),
		eUser: newexpUser.trim(),
		eId: newexpId,
		eDate: newexpDate.trim(),
	};
	newCollectDataArray.push(newCollectedDatafromEjs);
});
console.log(newCollectDataArray);

/*---- Code For Search Box Visiblity below Search bar  ----*/
const expenseContainer = document.querySelector('[data-expense-container]');
const expenseCardTemplate = document.querySelector('[data-expense-template]');
let newSortExpList = [];

function SetDefault(val) {
	SearchExpenseListVisible();
	let searchingval = val.toLowerCase();
	newSortExpList.forEach(elem => {
		let amountSearch = String(elem.eAmo);
		const isVi =
			elem.eCat.toLowerCase().includes(searchingval) ||
			elem.ePay.toLowerCase().includes(searchingval) ||
			elem.eRemark.toLowerCase().includes(searchingval) ||
			amountSearch.includes(searchingval);
		elem.element.classList.toggle('chup', !isVi);
	});
}
newSortExpList = newCollectDataArray.map(function (expData) {
	const expCard = expenseCardTemplate.content.cloneNode(true).children[0];
	const expCategoryValue = expCard.querySelector('[data-category]');
	const expAmountValue = expCard.querySelector('[data-amount]');
	const expPaymentValue = expCard.querySelector('[data-paymentMode]');
	const expRemarkValue = expCard.querySelector('[data-remark]');
	const expUserValue = expCard.querySelector('[data-user]');
	const expIdValue = expCard.querySelector('[data-id]');
	const expDateValue = expCard.querySelector('[data-date]');
	function unWantedDataHidden(){
		expUserValue.classList.add('hide');
		expIdValue.classList.add('hide');
	}
	expCategoryValue.textContent = expData.eCategory;
	expAmountValue.textContent = expData.eAmount;
	expPaymentValue.textContent = expData.ePaymenMode;
	expRemarkValue.textContent = expData.eRemark;
	expUserValue.textContent = expData.eUser;
	expIdValue.textContent = expData.eId;
	let setDate = new Date(expData.eDate);
	expDateValue.textContent = setDate.toLocaleString();
	console.log(new Date(expData.eDate));
	expenseContainer.append(expCard);
	unWantedDataHidden();
	return {
		eCat: expData.eCategory,
		eAmo: expData.eAmount,
		ePay: expData.ePaymenMode,
		eRemark: expData.eRemark,
		eUser: expData.eUser,
		eId: expData.eId,
		eDate: expData.eDate,
		element: expCard,
	};
});

/*-- Code for visibilty of Search box hover ON / OFF, dblclick on Center */
let SearchInput = document.getElementById('search-input');
function SearchExpenseListNotVisible() {
	document.querySelector('.search-showing').classList.remove('visible');
}
function SearchExpenseListVisible() {
	document.querySelector('.search-showing').classList.add('visible');
}
document.querySelector('.search-showing').addEventListener('mouseleave', () => {
	SearchExpenseListNotVisible();
});
document.querySelector('.center-container').addEventListener('dblclick', () => {
	SearchExpenseListNotVisible();
});
SearchInput.addEventListener('click', () => {
	SearchExpenseListVisible();
});
/*-- Code for visibilty of Search box hover ON / OFF, dblclick on Center */

// ---------------- Experiment Code ----------
function myExperiment() {
	function SetDefault(Text) {
		let sText = Text.toLowerCase();
		var slist = document.querySelectorAll('.searched-items li');
		slist.forEach(elem => {
			let presentText = elem.children[0].textContent.toLowerCase();
			if (presentText.includes(Text)) {
				elem.style.display = 'flex';
			} else {
				elem.style.display = 'none';
			}
		});
	}
}



/*  ------- DARK & LIGHT MODE ------- */
function DarkLightMode() {
	$(document).ready(function () {
		function DarkMode() {
			$('.sun').removeClass('hide');
			$('.moon').addClass('hide');
			$('.dlmode').html('Light Mode');
			$(':root').css('--darkWhite', '#0d0d0d');
			$(':root').css('--darkGray', '#f5f5f5');
			$(':root').css('--graycolor', '#f5f5f5');
			$(':root').css('--purplebg', '#f5f5f5');
			$(':root').css('--purpno', '#3a36c3');
			$(':root').css('--whiteBg', '#35353ad8');
			$(':root').css(
				'--mainLightBg',
				'112.1deg, rgb(32, 38, 57) 11.4%, rgb(63, 76, 119) 70.2%'
			);
		}
		function LighMode() {
			$('.sun').addClass('hide');
			$('.moon').removeClass('hide');
			$('.dlmode').html('Dark Mode');
			$(':root').css('--darkWhite', '#f5f5f5');
			$(':root').css('--darkGray', '#0d0d0d');
			$(':root').css('--purplebg', '#5955e7');
			$(':root').css('--purpno', 'transparent');
			$(':root').css('--whiteBg', 'rgba(255, 255, 255, 0.84)');
			$(':root').css(
				'--mainLightBg',
				`90deg, rgba(201, 200, 219, 1) 0%, rgba(164, 201, 255, 1) 35% ,
		rgba(160, 199, 213, 1) 70%, rgba(212, 248, 255, 1) 100%`
			);
			$(':root').css('--graycolor', '#333131');
		}
		let flag = 0;
		$('.darklightMode').click(function () {
			if (flag === 0) {
				console.log('true');
				DarkMode();
				flag = 1;
			} else {
				LighMode();
				flag = 0;
			}
		});
	});
}

/* ------ Expense overaly Container Click ----- */
function headOverlayOpenClose() {
	$(document).ready(function () {
		function overlayOpen() {
			$('.head-overlay').css('opacity', '1');
			$('.head-overlay').css('pointer-events', 'all');
			$('.head-overlay').css('height', '70vh');
		}
		function overlayClose() {
			$('.head-overlay').css('height', '0vh');
			$('.head-overlay').css('opacity', '0');
			$('.head-overlay').css('pointer-events', 'none');
		}
		// let flag = 0;
		$('.add-expenseBtn ,.add-incomeBtn').click(() => {
			overlayOpen();
		});
		$('.head-close').click(() => {
			overlayClose();
		});
	});
}





/* Add Expense / MOney form Submit function */
function submitExpense() {
	// Fetch values from the form
	const expenseName = document.getElementById('expenseName').value;
	const amount = document.getElementById('amount').value;
	const category = document.getElementById('category').value;
	const date = document.getElementById('datetime').value;
	const paymentMethod = document.getElementById('paymentMethod').value;

	// You can perform further actions with the collected data, such as sending it to the server or storing it locally.
	// For now, let's log the values to the console.
	console.log('Expense Name:', expenseName);
	console.log('Amount:', amount);
	console.log('Category:', category);
	console.log('Date:', date);
	console.log('Payment Method:', paymentMethod);

	// Optional: You can reset the form after submission
	// document.getElementById('expenseForm').reset();

	// Show success message
	document.getElementById('expenseForm').classList.add('form-submitted');
}