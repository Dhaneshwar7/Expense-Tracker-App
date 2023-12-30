/*  ------- DARK & LIGHT MODE ------- */
function DarkLightMode() {
	$(document).ready(function () {
		let darkmode = localStorage.getItem('darkmode');
		function DarkMode() {
			document.body.classList.add('darkmode');
			localStorage.setItem('darkmode', 'enabled');
            // console.log(darkmode);
			$('.sun').removeClass('hide');
			$('.moon').addClass('hide');
			$('.dlmode').html('Light Mode');
			$(':root').css('--darkWhite', '#0d0d0d');
			$(':root').css('--darkGray', '#f5f5f5');
			$(':root').css('--graycolor', '#f5f5f5');
			$(':root').css('--purplebg', '#f5f5f5');
			$(':root').css('--purpno', '#3a36c3');
			$(':root').css('--whiteBg', '#2a2a2cf6');
			$(':root').css(
				'--mainLightBg',
				'112.1deg, rgb(32, 38, 57) 11.4%, rgb(63, 76, 119) 70.2%'
			);
		}
		function LighMode() {
			document.body.classList.remove('darkmode');
			localStorage.setItem('darkmode', null);
            // console.log(darkmode);
			$('.sun').addClass('hide');
			$('.moon').removeClass('hide');
			$('.dlmode').html('Dark Mode');
			$(':root').css('--darkWhite', '#f5f5f5');
			$(':root').css('--darkGray', '#0d0d0d');
			$(':root').css('--purplebg', '#5955e7');
			$(':root').css('--purpno', 'transparent');
			$(':root').css('--whiteBg', 'rgba(255, 255, 255, 0.962)');
			$(':root').css(
				'--mainLightBg',
				`90deg, rgba(201, 200, 219, 1) 0%, rgba(164, 201, 255, 1) 35% ,
		rgba(160, 199, 213, 1) 70%, rgba(212, 248, 255, 1) 100%`
			);
			$(':root').css('--graycolor', '#333131');
		}
		if (darkmode === 'enabled') {
			DarkMode();
		}
		let flag = 0;

		$('.darklightMode').click(function () {
			darkmode = localStorage.getItem('darkmode');
			if (flag === 0 && darkmode !== 'enabled') {
				console.log('true');
				DarkMode();
                // console.log(darkmode);
				flag = 1;
			} else {
				LighMode();
                // console.log(darkmode);
				flag = 0;
			}
		});
	});
}
DarkLightMode();



// On page load set the theme.
// (function() {
//   let onpageLoad = localStorage.getItem('theme') || '';
// 	let onp = localStorage.getItem('font') || '';
//   let element = document.body;
//   console.log(onp);
//   console.log(onpageLoad);
//   element.classList.add(onpageLoad);
//   document.getElementById("theme").textContent =
//     localStorage.getItem("theme") || "light";
// })();

// function themeToggle() {
//   let element = document.body;
//   element.classList.toggle("dark-mode");

//   let theme = localStorage.getItem("theme");
//   if (theme && theme === "dark-mode") {
//     localStorage.setItem("theme", "");
//   } else {
//     localStorage.setItem("theme", "dark-mode");
//   }

//   document.getElementById("theme").textContent = localStorage.getItem("theme");
// }



