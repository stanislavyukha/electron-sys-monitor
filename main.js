const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const MainWindow = require('./MainWindow');
const path = require('path');
const Store = require('./Store');
const AppTray = require('./AppTray');

// Set env
process.env.NODE_ENV = 'development'

const isDev = process.env.NODE_ENV !== 'production' ? true : false
const isMac = process.platform === 'darwin' ? true : false

let mainWindow;
let tray;
//init store and defaults

const store = new Store({
  configName: "user-settings",
  defaults: {
    settings:{
      cpuOverload: 80,
      alertFrequency: 5,
    }
  }
})

function createMainWindow() {
  mainWindow = new MainWindow('./app/index.html', isDev)

}

app.on('ready', () => {
  createMainWindow();

  mainWindow.webContents.on('dom-ready', () => {
    mainWindow.webContents.send('settings:get', store.get('settings'))
  })

  const mainMenu = Menu.buildFromTemplate(menu);

  Menu.setApplicationMenu(mainMenu);
  mainWindow.on('close', ev => {
    if(!app.isQuitting) {
      ev.preventDefault();
      mainWindow.hide();
    }
    return true;
  })

  const icon = path.join(__dirname, 'assets', 'icons', 'tray_icon.png');
  //create tray
  tray = new AppTray(icon, mainWindow);


})

const menu = [
  ...(isMac ? [{ role: 'appMenu' }] : []),
  {
    role: 'fileMenu',
  },
  ...(isDev
    ? [
      {
        label: 'Developer',
        submenu: [
          { role: 'reload' },
          { role: 'forcereload' },
          { type: 'separator' },
          { role: 'toggledevtools' },
        ],
      },
    ]
    : []),
]
//set settings
ipcMain.on('settings:set', (ev, value) => {
  store.set('settings', value);
  mainWindow.webContents.send('settings:get', store.get('settings'))
})

app.on('window-all-closed', () => {
  if (!isMac) {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow()
  }
})


app.allowRendererProcessReuse = true;
