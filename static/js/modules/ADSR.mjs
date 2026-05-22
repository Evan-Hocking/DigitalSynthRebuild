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
        base.max = 1;
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
        attack.max = 5;
        attack.value = 0.1;
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
        decay.max = 5;
        decay.value = 0.1;
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
        release.max = 5;
        release.value = 0.1;
        ADSRControls.appendChild(release);



        UIContainer.appendChild(ADSRControls);
    }

    function init() {
        buildUI();
        document.addEventListener("noteDown", (e) => {
            // console.log(NodeID)
            console.log(document.getElementById(NodeID))
            // var paramvalue = document.getElementById(NodeID).value;

            var attack = document.getElementById(NodeID + '-ADSR-attack').value;
            var decay = document.getElementById(NodeID + '-ADSR-decay').value;
            var sustain = document.getElementById(NodeID + '-ADSR-sustain').value;
            console.log(NodeID + '-ADSR-attack', attack)

            console.log("Attack:", attack, "Decay:", decay, "Sustain:", sustain, "ParamValue:", paramvalue);
            var now = ctx.currentTime;

            audioParam.linearRampToValueAtTime(paramvalue, now + attack);
            audioParam.linearRampToValueAtTime(sustain * paramvalue, now + attack + decay);
        });



        document.addEventListener("noteUp", (e) => {
            // console.log(NodeID)
            var paramvalue = audioParam.value;
            var start = document.getElementById(NodeID + '-ADSR-base').value;
            var release = document.getElementById(NodeID + '-ADSR-release').value;
            // console.log("Release:", release, "Start:", start);
            audioParam.linearRampToValueAtTime(paramvalue * start, ctx.currentTime + release);
        });
    }

    init();


}


