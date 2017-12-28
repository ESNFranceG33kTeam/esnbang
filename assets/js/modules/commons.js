﻿var Universe = Universe || {};
const KonamiCode = require( "konami-code" );
const ipc = require('electron').ipcRenderer;
const fs = require('fs');
const remote = require('electron').remote;
const storage = remote.require('electron-json-storage-sync');
const path = require('path');

const konami = new KonamiCode();
konami.listen(function () {
	remote.getCurrentWindow().webContents.openDevTools();
	console.info('Dev tools have been opened :)');
});

String.prototype.hashCode = function() {
  return 'b' + this.split("").reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a},0);
};


/**
  * This module contains all operations and components used by several modules.
  * @module Universe/commons
  * @author Rémy Raes
  **/

Universe.commons = (function(){
	var _this = {};

	// application components
	_this.main_wrapper = document.getElementById('main_wrapper');


	_this.build = function(sites) {

		// build main sites
		fs.readFile(path.join(__dirname, '/websites.json'), 'utf8', function (err,data) {
			let new_sites = {};
			try {
				new_sites = JSON.parse(data);
			}catch(e) {
				console.error('Syntax error in the file websites.json.');
			}

			for(let i in new_sites) {
				let new_site = {
					name: i,
					url: new_sites[i],
					muted: false
				};
				Universe.menu.buttonManager.create_new_button(new_site, true);
				Universe.frameManager.create_new_frame(new_site, true);
			}

			// build added sites
			for(let i=0, length=sites.length; i<length; i++) {
				Universe.menu.buttonManager.create_new_button(sites[i]);
				Universe.frameManager.create_new_frame(sites[i]);
			}

			// actualisation
			Universe.frameManager.load_all_frames();
		});
	};

	// tutorial mode
	let span;
	let exampleButton;

	function init_tutorial_mode() {

		let logo = document.getElementsByClassName('img_center')[0];
		let menu = Universe.menu.get_home_menu();
		exampleButton = document.getElementsByClassName('section')[1];
		let addSiteButton = document.getElementsByClassName('section subscribe')[0];
		let newSiteWindow = Universe.subscription.get_new_site_window();
		let translations = Universe.i18n.tutorialMessages;
		let new_url = Universe.subscription.get_new_url();

		let targetBtn = document.createElement('div');
		targetBtn.className = 'tutorialSectionFocus';
		let icons = document.getElementById('icons');
		icons.appendChild(targetBtn);
		let mute = exampleButton.getElementsByClassName('mute')[0];
		console.log(mute);

		span = document.createElement('span');
		span.className = 'delete';
		span.innerText = 'x';
		exampleButton.appendChild(span);

		SpotlightJS.config({
			message: {
				positions: ['dir_top_center', 'dir_bottom_center', 'dir_right_middle']
			},
			arrow: {size: 11},
			navigation: {loop: true, await: false},
		}).add(
			'main', {
				element: logo,
				speed: 600,
				message: {
					icon: path.join('assets','img','icons','star.png'),
					buttons: [{
						text: translations.buttons.exit,
						click: function () {
							icons.removeChild(targetBtn);
							SpotlightJS.destroy();
						}
					},{
						text: translations.buttons.next,
						click: function () {
							SpotlightJS.next();
						}
					}],
					title: translations.main.title,
					body: translations.main.body
				},
			},
			'menu', {
				element: menu,
				speed: 600,
				message: {
					icon: path.join('assets','img','icons','star.png'),
					buttons: [{
						text: translations.buttons.previous,
						click: function () {
							SpotlightJS.previous();
						}
					},
					{
						text: translations.buttons.next,
						click: function () {
							SpotlightJS.next();
						}
					}],
					title: translations.menu.title,
					body: translations.menu.body
				},
				config: {borders: {radius: 2}}
			},
			'section', {
				element: exampleButton,
				speed: 600,
				message: {
					icon: path.join('assets','img','icons','star.png'),
					buttons: [{
						text: translations.buttons.previous,
						click: function () {
							SpotlightJS.previous();
						}
					},
					{
						text: translations.buttons.next,
						click: function () {
							exampleButton.className = 'sectionSettings';
							mute.className = 'mute mute-show';
							console.log(exampleButton);
							span.className = 'delete delete-show';
							SpotlightJS.next();
						}
					}],
					title: translations.section.title,
					body: translations.section.body
				},
				config: {borders: {radius: 10}}
			},
			'settingsMode', {
				element: targetBtn,
				speed: 600,
				message: {
					icon: path.join('assets','img','icons','star.png'),
					buttons: [{
						text: translations.buttons.previous,
						click: function () {
							exampleButton.className = 'section';
							mute.className = 'mute';
							span.className = 'delete';
							SpotlightJS.previous();
						}
					},
					{
						text: translations.buttons.next,
						click: function () {
							exampleButton.className = 'section';
							mute.className = 'mute';
							span.className = 'delete';
							SpotlightJS.next();
						}
					}],
					title: translations.settingsMode.title,
					body: translations.settingsMode.body
				},
				config: {borders: {radius: 2}}
			},
			'addsite', {
				element: addSiteButton,
				speed: 600,
				message: {
					icon: path.join('assets','img','icons','star.png'),
					buttons: [{
						text: translations.buttons.previous,
						click: function () {
							exampleButton.className = 'sectionSettings';
							mute.className = 'mute mute-show';
							span.className = 'delete delete-show';
							SpotlightJS.previous();
						}
					},
					{
						text: translations.buttons.next,
						click: function () {
							new_url.value = 'https://remyraes.com/';
							Universe.subscription.show_new_site_subscription();
							SpotlightJS.next();
						}
					}],
					title: translations.addsite.title,
					body: translations.addsite.body
				},
				config: {borders: {radius: 10}}

			},'newsite', {
				element: newSiteWindow,
				speed: 600,
				message: {
					icon: path.join('assets','img','icons','star.png'),
					buttons: [{
						text: translations.buttons.previous,
						click: function () {
							Universe.subscription.reset();
							SpotlightJS.previous();
						}
					},
					{
						text: translations.buttons.next,
						click: function () {
							Universe.subscription.reset();
							SpotlightJS.next();
						}
					}],
					title: translations.newsite.title,
					body: translations.newsite.body
				},
				config: {borders: {radius: 2}}
			},
			'end', {
				element: logo,
				speed: 600,
				message: {
					icon: path.join('assets','img','icons','star.png'),
					buttons: [{
						text: translations.buttons.exit,
						click: function () {
							icons.removeChild(targetBtn);
							SpotlightJS.destroy();
						}
					}],
					title: translations.end.title,
					body: translations.end.body
				}
			},

		);
	}

	_this.launch_tutorial_mode = function() {
		SpotlightJS.clear();
		init_tutorial_mode();
		SpotlightJS.spotlight('main', 'menu', 'section', 'settingsMode', 'addsite', 'newsite', 'end');
	};

	return _this;
})();
