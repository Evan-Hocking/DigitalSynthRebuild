let activeNodes = {};

let removeActiveModule
let ctx;

export function init(Nodes, NodeID, audioCtx, RemActMod) {
    ctx = audioCtx;
    removeActiveModule = RemActMod;
    let Node = ctx.createMediaStreamDestination(); //Set to module type
    activeNodes = Nodes;
    const outNode = new Audio();
    outNode.srcObject = Node.stream;

    buildUI(Node,NodeID, outNode);
 
    return Node;
}

function removeOptions(selectElement) {
   var i, L = selectElement.options.length - 1;
   for(i = L; i >= 0; i--) {
      selectElement.remove(i);
   }
}

export function updateActiveNodes(Nodes, NodeID){
    activeNodes = Nodes;
    console.log('Active nodes:', activeNodes);
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

function buildUI(Node,NodeID, outNode){
    var modulePanel = document.getElementById('module-panel');
    var NodeControls = document.createElement('div');
    NodeControls.id = NodeID + '-Controls';
    
    NodeControls.className = 'module';
    NodeControls.classList.add("module-box")
    modulePanel.appendChild(NodeControls);
    var moduleTitle = document.createElement('h2');
    moduleTitle.innerHTML = NodeID;
    NodeControls.appendChild(moduleTitle);

    


    var selectConnection = document.createElement('select');
    selectConnection.id = NodeID + '-connection';
    var options = Object.keys(activeNodes);
    var opt = document.createElement('option');
    opt.value = '';
    opt.disabled = true;
    opt.selected = true;
    opt.text = 'Select';
    selectConnection.appendChild(opt);
    navigator.mediaDevices.enumerateDevices().then(devices =>{
        const audioOutputs = devices.filter(device =>device.kind ==='audiooutput');

        audioOutputs.forEach(device => {
            opt = document.createElement('option');
            opt.value = device.deviceId;
            opt.text = device.label || `Output Device ${outputSelect.length}`;
            selectConnection.appendChild(opt);
        })
    })
    selectConnection.addEventListener('change', function (event) {
    outNode.setSinkId(selectConnection.value).then(() => {
        outNode.play();
        selectConnection.blur();
    }).catch(err => {
        console.error('Error setting sink ID:', err);
    });
});

    
    var selectConnectionLabel = document.createElement('label');
    selectConnectionLabel.innerHTML = 'Output to';
    selectConnectionLabel.setAttribute('for', NodeID + '-connection');
    NodeControls.appendChild(selectConnectionLabel);
    NodeControls.appendChild(selectConnection);

    
    var remove = document.createElement('button')
        remove.innerHTML = "Remove"
        remove.addEventListener('click', function (event){
            NodeControls.remove()
            removeActiveModule(NodeID)
        })
        NodeControls.appendChild(remove)



}
