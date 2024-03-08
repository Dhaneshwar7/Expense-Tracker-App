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
// console.log(newCollectDataArray);

/*---- Code For Search Box Visiblity below Search bar  ----*/
const expenseContainer = document.querySelector('[data-expense-container]');
const transactionContainer = document.querySelector(
	'[data-transaction-container]'
);
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
	function unWantedDataHidden() {
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
	// console.log(new Date(expData.eDate));
	expenseContainer.append(expCard);
	// transactionContainer.append(expCard);
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
function transactionListVisible() {
	document.querySelector('.transaction-showing').classList.add('visible');
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

/* ------ Expense overaly Container Click ----- */
function headOverlayOpenClose() {
	$(document).ready(function () {
		function overlayOpen() {
			$('.head-overlay').css('opacity', '1');
			$('.head-overlay').css('pointer-events', 'all');
			$('.head-overlay').css('height', '70vh');
			$('.overlay').css('scale', '1');
		}
		function overlayClose() {
			$('.head-overlay').css('height', '0vh');
			$('.head-overlay').css('opacity', '0');
			$('.head-overlay').css('pointer-events', 'none');
			$('.overlay').css('scale', '0');
		}
		// let flag = 0;
		$('.add-expenseBtn ,.add-incomeBtn').click(() => {
			overlayOpen();
		});
		$('.head-close').click(() => {
			overlayClose();
		});
		$('.add-expenseBtn').click(() => {
			$('.addIncomeForm').removeClass('formShow');
			$('.addExpenseForm').addClass('formShow');
		});
		$('.add-incomeBtn').click(() => {
			$('.addIncomeForm').addClass('formShow');
			$('.addExpenseForm').removeClass('formShow');
		});
	});
}

/* Add Expense / MOney form Submit function */
function submitExpense() {
	const expNumInput = $('.expenseNumInput').val().trim();
	const expNameInput = $('.expenseNameInput').val().trim();
	const expCatInput = $('.expenseCatInput').val();
	const expPaymentInput = $('#paymentMethod').val();
	if (
		expNameInput === '' ||
		expNumInput === '' ||
		expCatInput === null ||
		expPaymentInput === null
	) {
		$('.detailsfill-message').addClass('formMsg-show');
	} else {
		$('.detailsfill-message').removeClass('formMsg-show');
		$('.expense-success-message').addClass('formMsg-show');
	}
}
function submitIncome() {
	const addIncomeInput = $('.addIncomeInput').val();
	const addIncomeDescInput = $('.addIncomeDescInput').val().trim();
	const addIncomeCurrencyInput = $('.addIncomeCurrencyInput').val();
	console.log('yes');
	if (
		addIncomeInput === '' ||
		addIncomeDescInput === '' ||
		addIncomeCurrencyInput === null
	) {
		console.log('khali');
		$('.detailsfill-message').addClass('formMsg-show');
	} else {
		console.log('complete');
		$('.detailsfill-message').removeClass('formMsg-show');
		$('.income-success-message').addClass('formMsg-show');
	}
}
/* Select Date from calendar  ------ */
function selectCalendarDate() {
	var received_date = document.getElementById('month-input').value;
	console.log(received_date);

	// var split_dashes = received_date.split('-');

	// var final_date =
	// 	split_dashes[2] + '.' + split_dashes[1] + '.' + split_dashes[0];

	// document.getElementById('show_date').value = final_date;

	document.getElementById('wallet-calendar').submit();
}

function searchExpense(value) {
	console.log(value);
	let input = document.querySelector('#searchbar').value;
	input = input.toLowerCase();
	let x = document.querySelectorAll('.expCard');

	for (i = 0; i < x.length; i++) {
		if (!x[i].innerHTML.toLowerCase().includes(input)) {
			x[i].style.display = 'none';
		} else {
			x[i].style.display = 'table-row';
		}
	}
}
function okd(value) {
	alert('ddk');
	console.log('Clicked value:', value); // Print the value in the console
}
