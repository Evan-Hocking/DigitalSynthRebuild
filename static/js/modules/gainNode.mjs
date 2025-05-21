export function init(ctx){
    let gainNode = ctx.createGain();
    buildUI(ctx, gainNode);
    
    return gainNode;
}

function buildUI(ctx, gainNode){
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
}