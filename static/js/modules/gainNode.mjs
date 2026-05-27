let activeNodes = {};
let removeActiveModule;
let ctx

import { createADSR, removeADSR } from './ADSR.mjs';

export function init(Nodes, NodeID, audioCtx, RemActMod) {
    ctx = audioCtx;
    removeActiveModule = RemActMod;
    let gainNode = ctx.createGain();
    activeNodes = Nodes;
    console.log('Active nodes:', activeNodes);
    buildUI(gainNode, NodeID);
    return gainNode;
}

function removeOptions(selectElement) {
    var i, L = selectElement.options.length - 1;
    for (i = L; i >= 0; i--) {
        selectElement.remove(i);
    }
}

export function updateActiveNodes(Nodes, NodeID) {
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

function buildUI(gainNode, NodeID) {
    var modulePanel = document.getElementById('module-panel');
    var GainControls = document.createElement('div');
    GainControls.id = NodeID + '-Controls';

    GainControls.className = 'module';
    GainControls.classList.add("module-box")
    modulePanel.appendChild(GainControls);
    var moduleTitle = document.createElement('h2');
    moduleTitle.innerHTML = NodeID;
    GainControls.appendChild(moduleTitle);

    var gain = document.createElement('input');
    gain.classList.add("vertical-slider")
    gain.setAttribute('orient', 'vertical');
    gain.type = 'range';
    gain.id = NodeID + '-gain';
    gain.min = 0;
    gain.max = 100;
    gain.value = 50;
    GainControls.appendChild(gain);
    gain.addEventListener('input', function (event) {
        const existingADSR = document.getElementById(gain.id + '-ADSR-Controls');
        if (existingADSR) {
            const gainModifer = 100; //divides result to keep gain in an appropriate range, can be configured to change the maximum possible gain -> MaxGain = 100/gainModifier
            const gainValue = event.target.value / gainModifer;
            gainNode.gain.setValueAtTime(gainValue, ctx.currentTime);
            gain.blur()
        }

    });



    var gainLabel = document.createElement('label');
    gainLabel.innerHTML = 'Gain';
    gainLabel.setAttribute('for', 'gain');
    GainControls.appendChild(gainLabel);

    function isADSREnabled(NodeID) {
        const existingADSR = document.getElementById(NodeID + '-ADSR');
        return !!existingADSR;
    }
    var gainEnvelopeBtn = document.createElement('button');
    gainEnvelopeBtn.innerHTML = "Toggle ADSR";
    gainEnvelopeBtn.id = gain.id + '-ADSR-Toggle'
    gainEnvelopeBtn.addEventListener('click', function (event) {
        const existingADSR = document.getElementById(gain.id + '-ADSR-Controls');
        if (existingADSR) {
            existingADSR.remove();
            removeADSR(gain.id);
            const gainValue = document.getElementById(gain.id).value;
            gainNode.gain.value = gainValue;
        } else {
            createADSR(ctx, gainNode.gain, gain.id, GainControls);
        }
        console.log("ADSR toggled for", gain.id);
        
    })

    GainControls.appendChild(gainEnvelopeBtn);


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
        gainNode.disconnect();
        gainNode.connect(selectedNodeValue);
        selectConnection.blur()
    });

    var selectConnectionLabel = document.createElement('label');
    selectConnectionLabel.innerHTML = 'Connect to';
    selectConnectionLabel.setAttribute('for', NodeID + '-connection');
    GainControls.appendChild(selectConnectionLabel);
    GainControls.appendChild(selectConnection);
    var remove = document.createElement('button')
    remove.innerHTML = "Remove"
    remove.addEventListener('click', function (event) {
        GainControls.remove()
        removeActiveModule(NodeID)
    })
    GainControls.appendChild(remove)



}