const {app, BrowserWindow, Tray, Menu} = require('electron');

let win, tray, calc;


function createWindow () {
  win = new BrowserWindow({icon: "icon.png"});

  win.loadURL(`file://${__dirname}/index.html`);
  win.webContents.openDevTools();

  win.on('closed', () => {
    win = null
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
});

app.on('activate', () => {
  if (win === null) {
    createWindow()
  }
});


