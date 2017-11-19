# ESNbang!

![ESNbang! logo](https://raw.githubusercontent.com/ESNFranceG33kTeam/esnbang/master/assets/img/logo.png)
This application is meant to be used by ESNers all over the world ! It will enable them to gather all web resources they want in one single location, and to be notified if new content appears on those resources.

* [For developpers](#for-developers)
  * [Install Electron](#install-electron)
  * [Run the application](#run-the-application)
  * [Open the developer tools](#open-the-developer-tools)
  * [Package the application](#package-the-application)
* [For users](#for-users)
  * [Install ESNbang!](#install-esnbang)
  * [Use ESNbang!](#use-esnbang)
* [Patch notes](#patch-notes)

---

## For developers

### Install Electron 
Before installing Electron, you must have NodeJS installed on your computer with npm, its packet manager.

To install Electron, use npm like this:
```shell
# Install the `electron` command globally in your $PATH
npm install electron -g

# Install all project dependencies
cd esnbang/ && npm install
```

### Run the application
To launch the application, get into the application directory and launch Electron:
```shell
electron .
```

### Open the Developer Tools
If you want to open the dev tools inside the application, you just have to type in the Konami code :)

### Package the application
For Windows: `npm run package-windows`
For Mac: `npm run package-mac`
For Linux: `npm run package-linux`

---

## For users

### Install ESNbang!

To install the application, you need to download a version of it that has been compiled for your operating system
(Windows, Mac or Linux), and execute it.

[Executables are not available yet, because the application is still in development and hasn't reach the version
`1.0.0`]

| OS | Version | Download Link |
| :--: | :---: | :-----------: |
| Windows | `1.0.0` | ... |
| Mac OS | `1.0.0` | ... |
| Linux | `1.0.0` | ... |

### Use ESNbang!

Using the application is pretty easy, if you know all shortcuts ; you can find some tips below:
* to subscribe to a new website, you just have to click the '+' button at the bottom of the sidebar;
* to remove a website you added before, just right-click on its icon in the sidebar, and then click the delete button associated.


---

## Patch Notes

For the development of ESNbang!, we use the [semantic versioning](http://semver.org/).

* **[0.\*.\*] DEVELOPMENT VERSION**
  * **[0.2.1]**
    * Signals system reviewed: naviguation enhanced
    * Addition of the sites titles
    * Addition of the sites favicons
  * **[0.2.0]**
    * Addition of the internationalization (i18n)
  * **[0.1.1]**
    * You can now remove a website you added previously
    * Little code improvements for performance
  * **[0.1.0]**
    * You can now add a new website to your application !
    * Switching from iframes to webviews, to avoid `x-frame-origin` errors
  * **[0.0.1]**
    * Addition of the settings system
    * Addition of the notification system
    * All code has been documented
  * **[0.0.0]**
    * Introduction of the architecture main wrapper/side menu
    * Usage of iframes
    * Tooltips
