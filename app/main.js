const {app, BrowserWindow, Tray, Menu, MenuItem} = require('electron');

let win, tray, calc;

function createWindow () {
  win = new BrowserWindow({icon: "icon.png", minWidth: 770, resizable: false});

  win.loadURL(`file://${__dirname}/index.html`);

  win.on('closed', () => {
    win = null
  });

  win.once('ready-to-show', () => {
    let checkbox = getElementsByClassName('show_console');
    checkbox.onchange = function () {
      alert('ok');
    }

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


