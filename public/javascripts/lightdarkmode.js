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
			$(':root').css('--whiteBg', '#35353ad8');
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
			$(':root').css('--whiteBg', 'rgba(255, 255, 255, 0.84)');
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
