const serverUrl = window.location.origin;
export const ctx = new (window.AudioContext || window.webkitAudioContext)();
// window.ctx = ctx; // Expose ctx globally for modules
console.log(serverUrl)
import * as utils from './utils.mjs';
var moduleCounter = 0; //gives modules a numerical ID

const moduleDictionary = {};
const activeModules = {
    'Output': {
        'node': ctx.destination
    }
};

function init() {
    async function refreshModules() {
        fetchModulePaths().then(paths => {
            importModules(paths);
            console.log('Modules loaded:', paths);
        }, error => {
            console.error('Error loading modules:', error);
        });
    }

    const moduleSelect = document.getElementById('module-select');
    let loaded = false;
    moduleSelect.addEventListener('focus', async () => {
        if (!loaded) {
            await refreshModules();
            loaded = true;
        }
    });
    moduleSelect.addEventListener('blur', () => {
        loaded = false;
    });
    refreshModules();
}

init();




async function fetchModulePaths() {
    // Call the preload-exposed API instead of using require
    return await window.synthAPI.getModulePaths();
}

async function importModules(paths) {
    for (let key in moduleDictionary) {
        delete moduleDictionary[key];
    }
    const moduleSelect = document.getElementById('module-select');
    moduleSelect.innerHTML = "";

    const modulePromises = paths.map(path => import(path));
    const modules = await Promise.all(modulePromises);


    modules.forEach((module, index) => {
        var moduleName = paths[index].split('/').pop().split('.')[0]; // Extract module name from path
        console.log(moduleName)
        moduleName = utils.getTextAfterLastBackslash(moduleName)
        moduleDictionary[moduleName] = module;
    });


    var options = Object.keys(moduleDictionary);
    options.forEach(function (option) {
        var opt = document.createElement('option');
        opt.value = option;
        opt.text = option.charAt(0).toUpperCase() + option.slice(1);
        moduleSelect.appendChild(opt);
    });
}




document.getElementById('add-module-button').addEventListener('click', function () {
    const selectedKey = document.getElementById('module-select').value;
    console.log(selectedKey)
    const selectedModule = moduleDictionary[selectedKey];
    if (selectedModule && selectedModule.init) {
        activeModules[selectedKey + moduleCounter] = {
            'jsModule': selectedModule,
            'node': selectedModule.init(activeModules, selectedKey + moduleCounter, ctx, removeActiveModule)
        }
        moduleCounter += 1;
        setActiveModules()
        console.log(activeModules)
    }

});
export function removeActiveModule(moduleKey) {
    delete activeModules[moduleKey]
    setActiveModules()
}



function setActiveModules() {
    Object.entries(activeModules).forEach(([key, entry]) => {
        const module = entry.jsModule;
        if (module && module.updateActiveNodes) {
            module.updateActiveNodes(activeModules, key);
        }
    });
}
