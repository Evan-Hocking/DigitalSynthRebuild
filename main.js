const { app, BrowserWindow, ipcMain } = require('electron');
const fs = require('fs');
const path = require('path');

const userModulesDir = path.join(app.getPath('documents'), 'OpenSynthModules');
if (!fs.existsSync(userModulesDir)) {
  fs.mkdirSync(userModulesDir, { recursive: true });
}

// Always copy/overwrite template.mjs
const templateSrc = path.join(__dirname, 'static', 'js', 'modules', 'template.mjs');
const templateDest = path.join(userModulesDir, 'template.mjs');
if (fs.existsSync(templateSrc)) {
  fs.copyFileSync(templateSrc, templateDest);
}

function getModulePaths(directory) {
    let modulePaths = [];
    function walk(dir) {
        fs.readdirSync(dir).forEach(file => {
            if (file === 'template.mjs') return; // Ignore the template
            const fullPath = path.join(dir, file);
            if (fs.statSync(fullPath).isDirectory()) {
                walk(fullPath);
            } else if (file.endsWith('.mjs')) {
                modulePaths.push(path.relative(directory, fullPath));
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
        icon: path.join(__dirname, 'static', 'image', 'icons', 'key'),
        webPreferences: {
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
        }
    });
    win.maximize();
    win.loadFile('index.html');
}

app.whenReady().then(createWindow);

// IPC handler for module paths
ipcMain.handle('get-module-paths', async () => {
    const builtInModulesDir = path.join(__dirname, 'static/js/modules');
    const userModulesDir = path.join(app.getPath('documents'), 'OpenSynthModules');
    const builtInModules = getModulePaths(builtInModulesDir).map(p => {
        const absPath = path.join(builtInModulesDir, p);
        return 'file://' + absPath.replace(/\\/g, '/');
    });
    const userModules = getModulePaths(userModulesDir).map(p => {
        const absPath = path.join(userModulesDir, p);
        return 'file://' + absPath.replace(/\\/g, '/');
    });
    return [...builtInModules, ...userModules];
});