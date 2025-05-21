const serverUrl = window.location.origin;
const ctx = new (window.AudioContext || window.webkitAudioContext)();

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
            activeModules.push(module.init(ctx));
        }
        moduleDictionary[moduleName] = module;
    });
    console.log('Module dictionary:', moduleDictionary);

    console.log('Active modules:', activeModules);
    // for (let i = 0; i < activeModules.length - 1; i++) {
    //     const currentNode = activeModules[i];
    //     const nextNode = activeModules[i + 1];
    //     currentNode.connect(nextNode);

    // }


    // // Connect the last element in the chain to the destination
    // const lastNode = activeModules[activeModules.length - 1];

    // lastNode.connect(ctx.destination);


    activeModules[1].connect(activeModules[0]);
    activeModules[0].connect(ctx.destination);
}





fetchModulePaths().then(paths => {
    importModules(paths);
    console.log('Modules loaded:', paths);
});
