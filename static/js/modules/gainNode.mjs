let activeNodes = {};
let id = null;
import { ctx, removeActiveModule } from '../script.mjs';
export function init(Nodes,NodeID){
    let gainNode = ctx.createGain();
    activeNodes = Nodes;
    console.log('Active nodes:', activeNodes);
    id = NodeID
    buildUI(gainNode,NodeID);
    
    return gainNode;
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

function buildUI(gainNode,NodeID){
    var modulePanel = document.getElementById('module-panel');
    var GainControls = document.createElement('div');
    GainControls.id = id + '-Controls';
    
    GainControls.className = 'module';
    GainControls.classList.add("module-box")
    modulePanel.appendChild(GainControls);
    var moduleTitle = document.createElement('h2');
    moduleTitle.innerHTML = id;
    GainControls.appendChild(moduleTitle);

    var gain = document.createElement('input');
    gain.classList.add("vertical-slider")
    gain.setAttribute('orient', 'vertical');
    gain.type = 'range';
    gain.id = id;
    gain.min = 0;
    gain.max = 100;
    gain.value = 50;
    GainControls.appendChild(gain);
    gain.addEventListener('input', function (event) {
        const gainValue = event.target.value / 20;
        gainNode.gain.setValueAtTime(gainValue, ctx.currentTime);
        gain.blur()
    });
    var gainLabel = document.createElement('label');
    gainLabel.innerHTML = 'Gain';
    gainLabel.setAttribute('for', 'gain');
    GainControls.appendChild(gainLabel);


    var selectConnection = document.createElement('select');
    selectConnection.id = id + '-connection';
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
        gainNode.disconnect();
        gainNode.connect(selectedNodeValue);
        selectConnection.blur()
    });
    
    var selectConnectionLabel = document.createElement('label');
    selectConnectionLabel.innerHTML = 'Connect to';
    selectConnectionLabel.setAttribute('for', id + '-connection');
    GainControls.appendChild(selectConnectionLabel);
    GainControls.appendChild(selectConnection);
    var remove = document.createElement('button')
        remove.innerHTML = "Remove"
        remove.addEventListener('click', function (event){
            GainControls.remove()
            removeActiveModule(NodeID)
        })
        GainControls.appendChild(remove)



}