const serverUrl = window.location.origin;
export const ctx = new (window.AudioContext || window.webkitAudioContext)();
console.log(serverUrl)

let activeModules = [];

async function fetchModulePaths() {
    const response = await fetch('/get_module_paths');
    const paths = await response.json();
    return paths.map(path => `/static/js${path}`);
}


async function importModules(paths) {
    const modulePromises = paths.map(path => import(path));
    const modules = await Promise.all(modulePromises);

    const moduleDictionary = {};

    modules.forEach((module, index) => {
        const moduleName = paths[index].split('/').pop().split('.')[0]; // Extract module name from path
        if (module.init) {
           moduleDictionary[moduleName] = {
            'jsModule': module,
            'node': module.init(moduleDictionary)
            }
        }
        
    });
    moduleDictionary['Output'] = {'node':ctx.destination}
    console.log('ModuleDictionary:', moduleDictionary);

    Object.values(moduleDictionary).forEach(entry => {
    const module = entry.jsModule;
    if (module && module.updateActiveNodes) {
        module.updateActiveNodes(moduleDictionary);
        console.log('updated');
    }
});
}





fetchModulePaths().then(paths => {
    importModules(paths);
    console.log('Modules loaded:', paths);
});
