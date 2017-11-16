var ESNbang = ESNbang || {};

ESNbang.subscription = (function () {
	
	var _this = {};
	
	var new_site_window = document.getElementById('new_site');
	var new_url = document.getElementById('subscription_placeholder');
	var new_site_error = document.getElementById('subscription_text');

	
	/**
	  * This function makes the subscription window appear.
	  * @author Rémy Raes
	  **/
	_this.show_new_site_subscription = function() {
		ESNbang.commons.main_wrapper.style.filter = 'brightness(0.4)';
		new_site_window.style.display = 'block';
		new_site_window.style.animationName = 'bounceIn';
	}

	/**
	  * This function initializes the subscription window (style, animation, tooltip text).
	  * @author Rémy Raes
	  **/
	_this.reset = function() {
		ESNbang.commons.main_wrapper.style.filter = 'none';
		new_site_window.style.animationName = 'bounceOut';
		new_site_error.innerText = ESNbang.i18n.errorMessages.subscription_default_message;
		new_site_error.style.color = 'inherit';
		new_url.value = '';
	}

	/**
	  * This function sets a warning state on the subscription window.
	  * @param {String} message - The message to display to the user
	  * @author Rémy Raes
	  **/
	_this.set_new_site_warning = function(message) {
		new_site_window.style.animationName = 'bounceOut';
		setTimeout(function() {
			new_site_window.style.animationName = 'bounceWarning';
		}, 20);

		new_site_error.style.color = 'red';
		new_site_error.innerText = message;
	}

	return _this;

})();