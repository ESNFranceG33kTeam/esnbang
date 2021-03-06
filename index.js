if (require('electron-squirrel-startup')) return;
if (handleSquirrelEvent()) {
  return;
}

const electron = require('electron');
const app = electron.app;
const Tray = electron.Tray;
const Menu = electron.Menu;
const ipcMain = electron.ipcMain;
const BrowserWindow = electron.BrowserWindow;
const isDev = require('electron-is-dev');
const {appUpdater} = require('./assets/js/autoupdater');
const path = require('path');
let tray;

function handleSquirrelEvent() {
  if (process.argv.length === 1) {
    return false;
  }

  const ChildProcess = require('child_process');
  const path = require('path');

  const appFolder = path.resolve(process.execPath, '..');
  const rootAtomFolder = path.resolve(appFolder, '..');
  const updateDotExe = path.resolve(path.join(rootAtomFolder, 'Update.exe'));
  const exeName = path.basename(process.execPath);

  const spawn = function(command, args) {
    let spawnedProcess, error;

    try {
      spawnedProcess = ChildProcess.spawn(command, args, {detached: true});
  } catch (error) {}

    return spawnedProcess;
  };

  const spawnUpdate = function(args) {
    return spawn(updateDotExe, args);
  };

  const squirrelEvent = process.argv[1];
  switch (squirrelEvent) {
      case '--squirrel-firstrun':
            return true;
    case '--squirrel-install':
    case '--squirrel-updated':
      // Optionally do things such as:
      // - Add your .exe to the PATH
      // - Write to the registry for things like file associations and
      //   explorer context menus

      // Install desktop and start menu shortcuts
      spawnUpdate(['--createShortcut', exeName]);
      setTimeout(app.quit, 1000);
      return true;

    case '--squirrel-uninstall':
      // Undo anything you did in the --squirrel-install and
      // --squirrel-updated handlers

      // Remove desktop and start menu shortcuts
      spawnUpdate(['--removeShortcut', exeName]);
      setTimeout(app.quit, 1000);
      return true;

    case '--squirrel-obsolete':
      // This is called on the outgoing version of your app before
      // we update to the new version - it's the opposite of
      // --squirrel-updated

      app.quit();
      return true;
  }
};

var mainWindow;
app.setAppUserModelId('esnfrance.geekteam.universe');

const isSecondInstance = app.makeSingleInstance((commandLine, workingDirectory) => {
    // Someone tried to run a second instance, we should focus our window.
    if (mainWindow) {
        if (mainWindow.isMinimized())
            mainWindow.restore()
        mainWindow.show();
        mainWindow.focus();
    }
});

if (isSecondInstance) {
    app.quit();
}


// create the display window as soon as the application is ready
app.on('ready', createWindow);

// if all application windows have been closed, shutdown the application
app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

// on MacOS, enable the user to reopen the application after it has been "closed"
app.on('activate', () => {
	if (mainWindow === null) {
		createWindow();
	}
});

let iconpath = path.join('assets','img','icons','boussole.png');
function createWindow () {

	// notification icon
	var trayImage = path.join(__dirname, iconpath);
	tray = new Tray(trayImage);
	tray.setToolTip('Universe');

	// context menu on the icon
	const menu = Menu.buildFromTemplate([
		{
			label: 'Open application',
			click: () => {
				mainWindow.show();
			}
		},{
			label: 'Open ESN website',
			click: () => {
				electron.shell.openExternal('https://esn.org/');
			}
		},
		{
			type: 'separator'
		},
		{
			label: 'Close application',
			click: () => {
				mainWindow.destroy();
				app.quit();
			}
		}

	]);

	tray.setContextMenu(menu);
	tray.on('click', () => {
		mainWindow.show();
	});


    // tray listener
    ipcMain.on('tray_notif', function(event , data){
        tray.displayBalloon(data);
    });



	// main window
	mainWindow = new BrowserWindow({
		title: 'Universe',
		icon: __dirname + '/assets/img/icons/logo.png',
		backgroundColor: '#e0e0e0',

		width: 1050,
		height: 535,
		minWidth: 1050,
		minHeight: 535,

		show: false
    });
	app.setApplicationMenu(null);



    // setting up the window according to user settings
    ipcMain.on('get-params', function(event , data){

        let parameters = data;

        if(parameters.size.maximized)
            mainWindow.maximize();

        else {

            // centering the window
            mainWindow.setSize(parameters.size.width, parameters.size.height);
            mainWindow.center();
        }

        if(!isDev)
            appUpdater(mainWindow);

        mainWindow.show();
    });

    // show the window only when it's rendered
	mainWindow.once('ready-to-show', () => {
        // mainWindow.show();
	});



	mainWindow.loadURL(`file://${__dirname}/index.html`);
	// mainWindow.webContents.openDevTools();


	// hide the main window when the user clicks the 'close' button
	//For Windows
	mainWindow.on('close', (event) => {
		if (process.platform !== 'darwin'){
			event.preventDefault();
			mainWindow.webContents.send('exit-notification');
			mainWindow.hide();
		}
	});
	mainWindow.on('hide', (event) => {
		if (process.platform == 'darwin'){
			//event.preventDefault();
			mainWindow.webContents.send('exit-notification');
		}
	});



	// save window size
	mainWindow.on('resize', () => {
		send_changed_settings(false);
	});

	mainWindow.on('maximize', () => {
		send_changed_settings(true);
	});

}


var timer;
/**
  * This function is used to save user settings (see settings object model in
  * storage.js)
  * @author Rémy Raes
  **/
function send_changed_settings(max) {

	// using a timer to avoid too much function calls
	clearTimeout(timer);

	timer = setTimeout( () => {
		let tmp = mainWindow.getBounds();
		let size = {
			height: tmp.height,
			width: tmp.width,
			maximized: max
		}

		mainWindow.webContents.send('save_size', size);
	}, 500);

}
