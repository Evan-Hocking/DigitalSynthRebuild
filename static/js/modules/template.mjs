let activeNodes = {};

let removeActiveModule
let ctx;

export function init(Nodes, NodeID, audioCtx, RemActMod) {
    ctx = audioCtx;
    removeActiveModule = RemActMod;
    let Node = ctx.createGain(); //Set to module type
    activeNodes = Nodes;
    console.log('Active nodes:', activeNodes);
    buildUI(Node,NodeID);
 
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

function buildUI(Node,NodeID){
    var modulePanel = document.getElementById('module-panel');
    var NodeControls = document.createElement('div');
    NodeControls.id = NodeID + '-Controls';
    
    NodeControls.className = 'module';
    NodeControls.classList.add("module-box")
    modulePanel.appendChild(NodeControls);
    var moduleTitle = document.createElement('h2');
    moduleTitle.innerHTML = NodeID;
    NodeControls.appendChild(moduleTitle);

    var Slider = document.createElement('input');
    Slider.classList.add("vertical-slider")
    Slider.setAttribute('orient', 'vertical');
    Slider.type = 'range';
    Slider.id = NodeID;
    Slider.min = 0;
    Slider.max = 100;
    Slider.value = 50;
    NodeControls.appendChild(Slider);
    Slider.addEventListener('input', function (event) {
        const SliderModifer = 20; //divides result to keep gain in an appropriate range, can be configured to change the maximum possible gain -> MaxGain = 100/gainModifier
        const SliderValue = event.target.value / SliderModifer;
        Node.gain.setValueAtTime(SliderValue, ctx.currentTime);
        Slider.blur()
    });
    var SliderLabel = document.createElement('label');
    SliderLabel.innerHTML = 'Slider';
    SliderLabel.setAttribute('for', 'Node');
    NodeControls.appendChild(SliderLabel);


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
        remove.addEventListener('click', function (event){
            NodeControls.remove()
            removeActiveModule(NodeID)
        })
        NodeControls.appendChild(remove)



}
