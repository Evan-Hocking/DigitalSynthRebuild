const { app, BrowserWindow, ipcMain, Menu, shell } = require('electron');
const fs = require('fs');
const path = require('path');
const windowsShortcuts = require('windows-shortcuts');

const userDir = path.join(app.getPath('documents'), 'OpenSynth');
const userConfigsDir = path.join(userDir, 'Saves');
const userModulesDir = path.join(userDir, 'Modules');

function installApplication() {
    if (require('electron-squirrel-startup')) {
        initialiseUserFolder();
        createDesktopIcon();
        app.quit();
    }
}
function createDesktopIcon() {
    const desktopShortcutPath = path.join(app.getPath('desktop'), 'OpenSynth.lnk');
    if (!fs.existsSync(desktopShortcutPath)) {
        windowsShortcuts.create(desktopShortcutPath, {
            target: targetExe,
            desc: 'OpenSynth Shortcut',
            workingDir: path.dirname(targetExe),
        });
    }
}
function initialiseUserFolder() {
    const templateSrc = path.join(__dirname, 'static', 'js', 'modules', 'template.mjs');
    const templateDest = path.join(userModulesDir, 'template.mjs');

    if (!fs.existsSync(userDir)) {
        fs.mkdirSync(userDir, { recursive: true });
    }
    const targetExe = process.execPath;
    const shortcutPath = path.join(userDir, 'OpenSynth.lnk');

    // Create or overwrite shortcut
    if (!fs.existsSync(shortcutPath)) {
        windowsShortcuts.create(shortcutPath, {
            target: targetExe,
            desc: 'OpenSynth Shortcut',
            workingDir: path.dirname(targetExe),
        });
    }



    if (!fs.existsSync(userConfigsDir)) {
        fs.mkdirSync(userConfigsDir, { recursive: true });
    }

    if (!fs.existsSync(userModulesDir)) {
        fs.mkdirSync(userModulesDir, { recursive: true });
    }

    // Always copy/overwrite template.mjs

    if (fs.existsSync(templateSrc)) {
        fs.copyFileSync(templateSrc, templateDest);
    }
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

function createMenu() {
    const menuTemplate = [
        {
            label: 'File',
            submenu: [
                {
                    label: 'Open',
                    submenu: [
                        {
                            label: 'Modules',
                            click: () => shell.openPath(userModulesDir)
                        },
                        {
                            label: 'Saves',
                            click: () => shell.openPath(userConfigsDir)
                        },
                        { type: 'separator' },
                        {
                            label: 'Folder',
                            click: () => shell.openPath(userDir)
                        }
                    ]
                },
                { type: 'separator' },
                { role: 'quit', label: 'Exit' }
            ]
        },
        {
            label: 'Edit',
            submenu: [
                { role: 'undo' },
                { role: 'redo' },
                { type: 'separator' },
                { role: 'cut' },
                { role: 'copy' },
                { role: 'paste' },
                { role: 'delete' },
                { role: 'selectAll' }
            ]
        },
        {
            label: 'View',
            submenu: [
                { role: 'reload' },
                { role: 'forceReload' },
                { role: 'toggleDevTools' },
                { type: 'separator' },
                { role: 'resetZoom', label: 'Actual Size' },
                { role: 'zoomIn' },
                { role: 'zoomOut' },
                { type: 'separator' },
                { role: 'togglefullscreen' }
            ]
        },
        {
            label: 'Window',
            submenu: [
                { role: 'minimize' },
                { role: 'zoom' },
                { role: 'close' }
            ]
        },
        {
            label: 'Help',
            submenu: [
                {
                    label: 'Rebuild User Folders',
                    click: () => initialiseUserFolder()
                },
                {
                    label: 'Create Desktop Icon',
                    click: () => createDesktopIcon()
                },
                {
                    label: 'Learn More',
                    click: async () => {
                        await shell.openExternal('https://electronjs.org')
                    }
                },
                {
                    label: 'Documentation',
                    click: async () => {
                        await shell.openExternal('https://electronjs.org/docs')
                    }
                },
                {
                    label: 'Community Discussions',
                    click: async () => {
                        await shell.openExternal('https://www.electronjs.org/community')
                    }
                },
                {
                    label: 'Search Issues',
                    click: async () => {
                        await shell.openExternal('https://github.com/electron/electron/issues')
                    }
                }
            ]
        }
    ];

    const menu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(menu);
}

app.whenReady().then(() => {
    installApplication();
    createWindow();
    createMenu();
});

// IPC handler for module paths
ipcMain.handle('get-module-paths', async () => {
    const builtInModulesDir = path.join(__dirname, 'static/js/modules');
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