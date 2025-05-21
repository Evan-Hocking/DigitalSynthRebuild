let activeNodes = {};
import { ctx } from '../script.mjs';
export function init(Nodes){
    let gainNode = ctx.createGain();
    activeNodes = Nodes;
    console.log('Active nodes:', activeNodes);
    buildUI(gainNode);
    
    return gainNode;
}

function removeOptions(selectElement) {
   var i, L = selectElement.options.length - 1;
   for(i = L; i >= 0; i--) {
      selectElement.remove(i);
   }
}

export function updateActiveNodes(Nodes){
    activeNodes = Nodes;
    var selectConnection = document.getElementById('gain-connection');
    var options = Object.keys(activeNodes);
    removeOptions(selectConnection);
    options.forEach(function (option) {
        var opt = document.createElement('option');
        opt.value = option;
        opt.text = option.charAt(0).toUpperCase() + option.slice(1);
        selectConnection.appendChild(opt);
    });
    
}

function buildUI(gainNode){
    var modulePanel = document.getElementById('module-panel');
    var GainControls = document.createElement('div');
    GainControls.id = 'Gain-Controls';
    GainControls.className = 'module';
    modulePanel.appendChild(GainControls);
    var moduleTitle = document.createElement('h2');
    moduleTitle.innerHTML = 'Gain';
    GainControls.appendChild(moduleTitle);

    var gain = document.createElement('input');
    gain.type = 'range';
    gain.id = 'gain';
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
    selectConnection.id = 'gain-connection';
    var options = Object.keys(activeNodes);
    options.forEach(function (option) {
        var opt = document.createElement('option');
        opt.value = option;
        opt.text = option.charAt(0).toUpperCase() + option.slice(1);
        selectConnection.appendChild(opt);
    });
    selectConnection.addEventListener('change', function (event) {
        const selectedNode = event.target.value;
        const selectedNodeValue = activeNodes[selectedNode]['node'];
        console.log('active nodes:', activeNodes);
        console.log('Selected node:', selectedNode);
        console.log('Selected node Value:', selectedNodeValue);
        gainNode.disconnect();
        gainNode.connect(selectedNodeValue);
        selectConnection.blur()
    });
    GainControls.appendChild(selectConnection);
    var selectConnectionLabel = document.createElement('label');
    selectConnectionLabel.innerHTML = 'Connect to';
    selectConnectionLabel.setAttribute('for', 'gain-connection');
    GainControls.appendChild(selectConnectionLabel);
    



}