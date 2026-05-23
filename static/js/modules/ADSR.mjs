let activeEnvelopes = {};

export function createADSR(ctx, audioParam, NodeID, UIContainer) {
    function buildUI() {
        var ADSRControls = document.createElement('div');
        ADSRControls.id = NodeID + '-ADSR-Controls';
        ADSRControls.className = 'module';
        ADSRControls.classList.add("module-box")

        //base slider
        var baseLabel = document.createElement('label');
        baseLabel.innerHTML = 'Base';
        baseLabel.setAttribute('for', 'base');
        ADSRControls.appendChild(baseLabel);

        var base = document.createElement('input');
        base.type = 'range';
        base.id = NodeID + '-ADSR-base';
        base.min = 0;
        base.max = 100;
        base.value = 0;
        ADSRControls.appendChild(base);

        //attack slider
        var attackLabel = document.createElement('label');
        attackLabel.innerHTML = 'Attack';
        attackLabel.setAttribute('for', 'attack');
        ADSRControls.appendChild(attackLabel);

        var attack = document.createElement('input');
        attack.type = 'range';
        attack.id = NodeID + '-ADSR-attack';
        attack.min = 0;
        attack.max = 100;
        attack.value = 5;
        ADSRControls.appendChild(attack);

        //decay slider
        var decayLabel = document.createElement('label');
        decayLabel.innerHTML = 'Decay';
        decayLabel.setAttribute('for', 'decay');
        ADSRControls.appendChild(decayLabel);

        var decay = document.createElement('input');
        decay.type = 'range';
        decay.id = NodeID + '-ADSR-decay';
        decay.min = 0;
        decay.max = 100;
        decay.value = 10;
        ADSRControls.appendChild(decay);

        //sustain slider
        var sustainLabel = document.createElement('label');
        sustainLabel.innerHTML = 'Sustain';
        sustainLabel.setAttribute('for', 'sustain');
        ADSRControls.appendChild(sustainLabel);

        var sustain = document.createElement('input');
        sustain.type = 'range';
        sustain.id = NodeID + '-ADSR-sustain';
        sustain.min = 0;
        sustain.max = 100;
        sustain.value = 50;
        ADSRControls.appendChild(sustain);

        //release slider
        var releaseLabel = document.createElement('label');
        releaseLabel.innerHTML = 'Release';
        releaseLabel.setAttribute('for', 'release');
        ADSRControls.appendChild(releaseLabel);

        var release = document.createElement('input');
        release.type = 'range';
        release.id = NodeID + '-ADSR-release';
        release.min = 0;
        release.max = 100;
        release.value = 10;
        ADSRControls.appendChild(release);



        UIContainer.appendChild(ADSRControls);
    }

    function init(NodeID) {
        activeEnvelopes[NodeID] = audioParam;
        console.log("Active Envelopes:", activeEnvelopes);
        buildUI();
        document.addEventListener("noteDown", (e) => {
            for (let key in activeEnvelopes) {
                NodeID = key;
                audioParam = activeEnvelopes[key];

                var paramvalue = document.getElementById(NodeID).value/100;



                var attack = document.getElementById(NodeID + '-ADSR-attack').value/20;
                var decay = document.getElementById(NodeID + '-ADSR-decay').value/20;
                var sustain = document.getElementById(NodeID + '-ADSR-sustain').value/100;

                var now = ctx.currentTime;

                console.log(paramvalue, attack, decay, sustain, now);
                audioParam.cancelScheduledValues(now);
                audioParam.linearRampToValueAtTime(audioParam.value, now);
                audioParam.linearRampToValueAtTime(paramvalue, now + attack);
                audioParam.linearRampToValueAtTime(sustain * paramvalue, now + attack + decay);
                
            }
        });



        document.addEventListener("noteUp", (e) => {
            for (let key in activeEnvelopes) {
                NodeID = key;
                var paramvalue = document.getElementById(NodeID).value/100;
                var start = document.getElementById(NodeID + '-ADSR-base').value/100;
                var release = document.getElementById(NodeID + '-ADSR-release').value/20;
                audioParam.cancelScheduledValues(ctx.currentTime);
                audioParam.linearRampToValueAtTime(audioParam.value, ctx.currentTime);
                audioParam.linearRampToValueAtTime(paramvalue * start, ctx.currentTime + release);
            }
        });
    }

    init(NodeID);


}

export function removeADSR(NodeID) {
    delete activeEnvelopes[NodeID];
}