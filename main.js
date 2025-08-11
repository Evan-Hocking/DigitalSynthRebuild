const { app, BrowserWindow, ipcMain } = require('electron');
const fs = require('fs');
const path = require('path');

function getModulePaths(directory) {
    let modulePaths = [];
    function walk(dir) {
        fs.readdirSync(dir).forEach(file => {
            const fullPath = path.join(dir, file);
            if (fs.statSync(fullPath).isDirectory()) {
                walk(fullPath);
            } else if (file.endsWith('.mjs')) {
                // Make path relative to static/js for browser import
                modulePaths.push(path.relative(path.join(__dirname, 'static', 'js'), fullPath));
            }
        });
    }
    walk(directory);
    return modulePaths;
}

function createWindow() {
    const win = new BrowserWindow({
        width: 1000,
        height: 800,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false, // For simplicity; use preload.js for better security
        }
    });
    win.loadFile('index.html');
}

app.whenReady().then(createWindow);

// IPC handler for module paths
ipcMain.handle('get-module-paths', async () => {
    const directoryPath = path.join(__dirname, 'static/js/modules');
    const modulePaths = getModulePaths(directoryPath);
    // Return absolute file URLs
    return modulePaths.map(p => {
        const absPath = path.join(__dirname, 'static', 'js', p);
        return 'file://' + absPath.replace(/\\/g, '/');
    });
});