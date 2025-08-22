let activeNodes = {};

let removeActiveModule
let ctx;

export function init(Nodes, NodeID, audioCtx, RemActMod) {
    ctx = audioCtx;
    removeActiveModule = RemActMod;
    let Node = ctx.createGain(); //Set to module type
    activeNodes = Nodes;

    buildUI(Node, NodeID);

    return Node;
}

function removeOptions(selectElement) {
    var i, L = selectElement.options.length - 1;
    for (i = L; i >= 0; i--) {
        selectElement.remove(i);
    }
}

export function updateActiveNodes(Nodes, NodeID) {
    activeNodes = Nodes;

    var selectConnection = document.getElementById(NodeID + '-connection');
    var options = Object.keys(activeNodes);
    removeOptions(selectConnection);
    var opt = document.createElement('option');
    opt.value = '';
    opt.disabled = true;
    opt.selected = true;
    opt.text = 'Select';
    selectConnection.appendChild(opt);
    options.forEach(function (option) {
        var opt = document.createElement('option');
        opt.value = option;
        opt.text = option.charAt(0).toUpperCase() + option.slice(1);
        selectConnection.appendChild(opt);
    });

}

function buildUI(Node, NodeID) {
    var modulePanel = document.getElementById('module-panel');
    var NodeControls = document.createElement('div');
    NodeControls.id = NodeID + '-Controls';

    NodeControls.className = 'module';
    NodeControls.classList.add("module-box")
    modulePanel.appendChild(NodeControls);
    var moduleTitle = document.createElement('h2');
    moduleTitle.innerHTML = NodeID;
    NodeControls.appendChild(moduleTitle);

    const moduleLabel = document.createElement("p");
    moduleLabel.id = NodeID + "-label";
    moduleLabel.innerHTML = "This module has no function, only serving as a visual reference. Signal Chains can be merged by connecting to the same module."
    NodeControls.appendChild(moduleLabel)


    var selectConnection = document.createElement('select');
    selectConnection.id = NodeID + '-connection';
    var options = Object.keys(activeNodes);
    var opt = document.createElement('option');
    opt.value = '';
    opt.disabled = true;
    opt.selected = true;
    opt.text = 'Select';
    selectConnection.appendChild(opt);
    options.forEach(function (option) {
        opt = document.createElement('option');
        opt.value = option;
        opt.text = option.charAt(0).toUpperCase() + option.slice(1);
        selectConnection.appendChild(opt);
    });
    selectConnection.addEventListener('change', function (event) {
        const selectedNode = event.target.value;
        const selectedNodeValue = activeNodes[selectedNode]['node'];
        Node.disconnect();
        Node.connect(selectedNodeValue);
        selectConnection.blur()
    });

    var selectConnectionLabel = document.createElement('label');
    selectConnectionLabel.innerHTML = 'Connect to';
    selectConnectionLabel.setAttribute('for', NodeID + '-connection');
    NodeControls.appendChild(selectConnectionLabel);
    NodeControls.appendChild(selectConnection);


    var remove = document.createElement('button')
    remove.innerHTML = "Remove"
    remove.addEventListener('click', function (event) {
        NodeControls.remove()
        removeActiveModule(NodeID)
    })
    NodeControls.appendChild(remove)



}
