const serverUrl = window.location.origin;
export const ctx = new (window.AudioContext || window.webkitAudioContext)();
console.log(serverUrl)
var moduleCounter = 0;

const moduleDictionary = {};
const activeModules = {};
activeModules['Output'] = { 'node': ctx.destination }
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
        moduleName = getTextAfterLastBackslash(moduleName)
        moduleDictionary[moduleName] = module;
    });

    // modules.forEach((module, index) => {
    //     const moduleName = paths[index].split('/').pop().split('.')[0]; // Extract module name from path
    //     if (module.init) {
    //         activeModules[moduleName] = {
    //             'jsModule': module,
    //             'node': module.init(activeModules)
    //         }
    //     }

    // });




    var moduleSelect = document.getElementById('module-select');
    var options = Object.keys(moduleDictionary);
    options.forEach(function (option) {
        var opt = document.createElement('option');
        opt.value = option;
        opt.text = option.charAt(0).toUpperCase() + option.slice(1);
        moduleSelect.appendChild(opt);
    });
}


function getTextAfterLastBackslash(path) {
    const parts = path.split('\\');
    return parts[parts.length - 1];
}




fetchModulePaths().then(paths => {
    importModules(paths);
    console.log('Modules loaded:', paths);
});

document.getElementById('add-module-button').addEventListener('click', function () {
    const selectedKey = document.getElementById('module-select').value;
    console.log(selectedKey)
    const selectedModule = moduleDictionary[selectedKey];
    if (selectedModule && selectedModule.init) {
        activeModules[selectedKey + moduleCounter] = {
            'jsModule': selectedModule,
            'node': selectedModule.init(activeModules,selectedKey + moduleCounter)
        }
        moduleCounter +=1;

    }
    Object.values(activeModules).forEach(entry => {
        const module = entry.jsModule;
        if (module && module.updateActiveNodes) {
            module.updateActiveNodes(activeModules);
            console.log('updated');
        }
    });
});