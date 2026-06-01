let activeNodes = {};
let removeActiveModule;
let ctx

import { createADSR, removeADSR } from './ADSR.mjs';

export function init(Nodes, NodeID, audioCtx, RemActMod) {
    ctx = audioCtx;
    removeActiveModule = RemActMod;
    let Node = ctx.createBiquadFilter();
    activeNodes = Nodes;
    console.log('Active nodes:', activeNodes);
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

    var freq = document.createElement('input');
    var sampleRate = ctx.sampleRate;
    freq.classList.add("vertical-slider")
    freq.setAttribute('orient', 'vertical');
    freq.type = 'range';
    freq.id = NodeID + '-freq';
    freq.min = 0;
    freq.max = sampleRate/8;
    freq.value = sampleRate/32;
    NodeControls.appendChild(freq);
    freq.addEventListener('input', function (event) {
        const existingADSR = document.getElementById(freq.id + '-ADSR-Controls');
        if (existingADSR) {
            const freqModifer = 100; 
            const freqValue = event.target.value / freqModifer;
            Node.frequency.setValueAtTime(freqValue, ctx.currentTime);
            freq.blur()
        }

    });

    var freqLabel = document.createElement('label');
    freqLabel.innerHTML = 'Frequency';
    freqLabel.setAttribute('for', 'freq');
    NodeControls.appendChild(freqLabel);

    function isADSREnabled(NodeID) {
        const existingADSR = document.getElementById(NodeID + '-ADSR');
        return !!existingADSR;
    }
    var freqEnvelopeBtn = document.createElement('button');
    freqEnvelopeBtn.innerHTML = "Toggle ADSR";
    freqEnvelopeBtn.id = freq.id + '-ADSR-Toggle'
    freqEnvelopeBtn.addEventListener('click', function (event) {
        const existingADSR = document.getElementById(freq.id + '-ADSR-Controls');
        if (existingADSR) {
            existingADSR.remove();
            removeADSR(freq.id);
            const freqValue = document.getElementById(freq.id).value;
            Node.frequency.value = freqValue;
        } else {
            createADSR(ctx, Node.frequency, freq.id, NodeControls);
        }
        console.log("ADSR toggled for", freq.id);
        
    })

    NodeControls.appendChild(freqEnvelopeBtn);

    var Resonance = document.createElement('input');
    Resonance.classList.add("vertical-slider")
    Resonance.setAttribute('orient', 'vertical');
    Resonance.type = 'range';
    Resonance.id = NodeID + '-Resonance';
    Resonance.min = 0;
    Resonance.max = 10;
    Resonance.value = 1;
    NodeControls.appendChild(Resonance);
    Resonance.addEventListener('input', function (event) {
        const existingADSR = document.getElementById(Resonance.id + '-ADSR-Controls');
        if (existingADSR) {
            const ResonanceModifer = 100;
            const ResonanceValue = event.target.value / ResonanceModifer;
            Node.Q.setValueAtTime(ResonanceValue, ctx.currentTime);
            Resonance.blur()
        }

    });

    var ResonanceLabel = document.createElement('label');
    ResonanceLabel.innerHTML = 'Resonance';
    ResonanceLabel.setAttribute('for', 'Resonance');
    NodeControls.appendChild(ResonanceLabel);

    function isADSREnabled(NodeID) {
        const existingADSR = document.getElementById(NodeID + '-ADSR');
        return !!existingADSR;
    }
    var ResonanceEnvelopeBtn = document.createElement('button');
    ResonanceEnvelopeBtn.innerHTML = "Toggle ADSR";
    ResonanceEnvelopeBtn.id = Resonance.id + '-ADSR-Toggle'
    ResonanceEnvelopeBtn.addEventListener('click', function (event) {
        const existingADSR = document.getElementById(Resonance.id + '-ADSR-Controls');
        if (existingADSR) {
            existingADSR.remove();
            removeADSR(Resonance.id);
            const ResonanceValue = document.getElementById(Resonance.id).value;
            Node.Q.value = ResonanceValue;
        } else {
            createADSR(ctx, Node.Q, Resonance.id, NodeControls);
        }
        console.log("ADSR toggled for", Resonance.id);
        
    })

    NodeControls.appendChild(ResonanceEnvelopeBtn);





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