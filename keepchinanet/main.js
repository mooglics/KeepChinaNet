const electron = require('electron')
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

const ipcMain = electron.ipcMain;

// 引入依赖包

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

global.APP_CONFIG = {
  isDevelopment : true,
  version: '1.0.0'
};

if (global.APP_CONFIG.isDevelopment) {
    require('electron-reload')(__dirname, {
        ignored: /node_modules|[\/\\]\./
    });
}






function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 800, height: 600, resizable : false})

  // and load the index.html of the app.
  mainWindow.loadURL(`file://${__dirname}/index.html`)

  // Open the DevTools.
  if (APP_CONFIG.isDevelopment) {
  mainWindow.webContents.openDevTools()
  }

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    console.log("主窗口被关闭");
    mainWindow = null
    onlineStatusWindow.close();
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
let onlineStatusWindow;

app.on('ready', function() {
  console.log("app starting...");
  createWindow();
  onlineStatusWindow = new BrowserWindow({ width: 400, height: 300, show: false , frame : false, resizable : false});
  if (global.APP_CONFIG.isDevelopment) {
    onlineStatusWindow.webContents.openDevTools()
  }
  onlineStatusWindow.loadURL(`file://${__dirname}/online-status.html`);
});

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  console.log("window-all-closed");
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== `darwin`) {
    app.quit()
  }
})

app.on('activate', function () {
  console.log("app activate");
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

ipcMain.on('online-status-changed', function(event, status) {
  console.log("收到在线/离线状态的变化通知 %s",status);
  mainWindow.webContents.send('online-status-changed',status)
});


