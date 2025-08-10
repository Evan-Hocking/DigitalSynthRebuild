const serverUrl = window.location.origin;
export const ctx = new (window.AudioContext || window.webkitAudioContext)();
console.log(serverUrl)
import * as utils from './utils.mjs';
var moduleCounter = 0; //gives modules a numerical ID

const moduleDictionary = {};
const activeModules = {
    'Output': {
        'node': ctx.destination
    }
};

function init(){
    fetchModulePaths().then(paths => {
        importModules(paths);
        console.log('Modules loaded:', paths);
    });
}

init()

// activeModules['Output'] = { 'node': ctx.destination }
async function fetchModulePaths() {
    const response = await fetch('/get_module_paths');
    const paths = await response.json();
    return paths.map(path => `/static/js${path}`);
}


async function importModules(paths) {
    const modulePromises = paths.map(path => import(path));
    const modules = await Promise.all(modulePromises);



    modules.forEach((module, index) => {
        var moduleName = paths[index].split('/').pop().split('.')[0]; // Extract module name from path
        console.log(moduleName)
        moduleName = utils.getTextAfterLastBackslash(moduleName)
        moduleDictionary[moduleName] = module;
    });

    var moduleSelect = document.getElementById('module-select');
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
            'node': selectedModule.init(activeModules, selectedKey + moduleCounter)
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
