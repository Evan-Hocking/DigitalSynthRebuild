let activeFrequency = null;
const activeKeys = new Map();
let activeSource = null;
let oscillatorGain = null;
let activeNodes = {};
let removeActiveModule;
let ctx;

export function init(Nodes, NodeID, audioCtx, RemActMod) {
    ctx = audioCtx;
    removeActiveModule = RemActMod;
    activeNodes = Nodes;
    activeSource = ctx.createOscillator();
    oscillatorGain = ctx.createGain();
    oscillatorGain.gain.value = 0;
    activeSource.connect(oscillatorGain);
    buildUI(NodeID);

    return oscillatorGain;
}
function buildUI(NodeID) {
    // Create the controller panel
    var modulePanel = document.getElementById('module-panel');
    var oscilattorControls = document.createElement('div');
    oscilattorControls.id = NodeID + '-controls';
    oscilattorControls.className = 'module';
    oscilattorControls.classList.add("module-box")
    modulePanel.appendChild(oscilattorControls);
    var moduleTitle = document.createElement('h2');
    moduleTitle.innerHTML = NodeID;
    oscilattorControls.appendChild(moduleTitle);


    var WaveformSelect = document.createElement('select');
    WaveformSelect.id = NodeID + '-waveform-select';
    var waveforms = ['sine', 'square', 'sawtooth', 'triangle'];
    waveforms.forEach(function (waveform) {
        var option = document.createElement('option');
        option.value = waveform;
        option.text = waveform.charAt(0).toUpperCase() + waveform.slice(1); //capitalises first character
        WaveformSelect.appendChild(option);
    });
    WaveformSelect.addEventListener('change', function (event) {
        const selectedWaveform = event.target.value;
        activeSource.type = selectedWaveform;
        WaveformSelect.blur() //removes focus, fixes bug of keyboard presed changing selected waveform
    });

    var WaveformLabel = document.createElement('label');
    WaveformLabel.innerHTML = 'Waveform';
    WaveformLabel.setAttribute('for', 'waveform-select');
    oscilattorControls.appendChild(WaveformLabel);
    oscilattorControls.appendChild(WaveformSelect);


    var gain = document.createElement('input');
    gain.type = 'range';
    gain.id = NodeID + '-gain';
    gain.setAttribute('orient', 'vertical');
    gain.classList.add("vertical-slider")
    gain.min = 0;
    gain.max = 100;
    gain.value = 50;
    oscilattorControls.appendChild(gain);
    var gainLabel = document.createElement('label');
    gainLabel.innerHTML = 'Gain';
    gainLabel.setAttribute('for', 'gain');
    oscilattorControls.appendChild(gainLabel);

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
        var opt = document.createElement('option');
        opt.value = option;
        opt.text = option.charAt(0).toUpperCase() + option.slice(1);
        selectConnection.appendChild(opt);
    });
    selectConnection.addEventListener('change', function (event) {
        const selectedNode = event.target.value;
        const selectedNodeValue = activeNodes[selectedNode]['node'];
        oscillatorGain.disconnect();
        oscillatorGain.connect(selectedNodeValue);
        selectConnection.blur()
    });
    var selectConnectionLabel = document.createElement('label');
    selectConnectionLabel.innerHTML = 'Connect to';
    selectConnectionLabel.setAttribute('for', NodeID + '-connection');
    oscilattorControls.appendChild(selectConnectionLabel);
    oscilattorControls.appendChild(selectConnection);

    var keys = buildKeys(NodeID);
    var controllerPanel = document.getElementById('controller-panel');
    controllerPanel.appendChild(keys);

    var remove = document.createElement('button')
    remove.innerHTML = "Remove"
    remove.addEventListener('click', function (event) {
        oscilattorControls.remove()
        keys.remove()
        removeActiveModule(NodeID)
    })
    oscilattorControls.appendChild(remove)
}
function buildKeys(NodeID) {
    const keyOrder = [
        'tab', '1', 'q', '2', 'w', 'e', '4', 'r', '5', 't', '6', 'y',
        'u', '8', 'i', '9', 'o', 'p', '-', '[', '=', ']', 'backspace', 'enter'
    ];
    const notes = ['C', 'D', 'E', 'F', 'G', 'A', 'B']

    var keys = document.createElement('div');
    keys.id = NodeID + 'keys';
    keys.classList.add("keys")
    var defaultOctave = 4;
    var visibleOctaves = 3;
    let keyIndex = 0;
    for (var octave = defaultOctave; octave < defaultOctave + visibleOctaves; octave++) {
        //generates whole object
        for (var i = 0; i < notes.length; i++) {
            var hasSharp = true;
            var note = notes[i];
            //tests if note has accomanying sharp
            if (note == 'E' || note == 'B') {
                hasSharp = false;
            }

            //generates white note
            var whitekey = createKey("whitenote", note + octave, keyOrder[keyIndex++], NodeID)

            //generates black note
            if (hasSharp) {
                var blackkey = createKey("blacknote", note + '#' + octave, keyOrder[keyIndex++], NodeID)

                whitekey.appendChild(blackkey);
            }
            keys.appendChild(whitekey);
        }
    }
    // document.getElementById('controller-panel').innerHTML = html;
    return keys
}

function createKey(keyClass, note, computerKey, NodeID) {
    var key = document.createElement('div')
    key.className = keyClass
    key.dataset.note = note
    key.id = note

    key.addEventListener('mousedown', function () {
        noteDown(this.dataset.note, this.dataset.note.includes('#'), NodeID)
    })
    key.addEventListener('mouseup', function () {
        noteUp(this.dataset.note, this.dataset.note.includes('#'), NodeID)
    })
    key.addEventListener('mouseout', function () {
        noteUp(this.dataset.note, this.dataset.note.includes('#'), NodeID)
    })
    if (computerKey !== undefined) {
        listenForKeyDown(computerKey, note, () => noteDown(note, note.includes('#'), NodeID))
        listenForKeyUp(computerKey, note, () => noteUp(note, note.includes('#'), NodeID))
    }
    return key
}


function listenForKeyDown(targetKey, note, callback) {
    document.addEventListener('keydown', function handler(event) {
        if (event.key.toLowerCase() === targetKey.toLowerCase()) {
            if (!activeKeys.has(targetKey)) {
                activeKeys.set(targetKey, note)
                callback(event)
            }
        }
    });
}
function listenForKeyUp(targetKey, note, callback) {
    document.addEventListener('keyup', function handler(event) {
        if (event.key.toLowerCase() === targetKey.toLowerCase()) {
            if (activeKeys.has(targetKey)) {
                activeKeys.delete(targetKey);
                callback(event)
            }
        }
    });
}


function noteUp(note, isSharp, NodeID) {

    const elem = document.querySelector(`[data-note="${note}"]`);
    elem.style.background = isSharp ? '#292929' : 'white';

    if (activeKeys.size > 0) {
        const lastKey = Array.from(activeKeys.keys()).pop();
        const lastNote = activeKeys.get(lastKey);
        noteDown(lastNote, lastNote.includes('#'), NodeID)
    } else {
        var now = ctx.currentTime;

        oscillatorGain.gain.value = 0;
        const event = new CustomEvent("noteUp", {
            detail: { message: "NoteUp" }
        });
        document.dispatchEvent(event);
    }


}

//controls behaviour for when a note is pressed
function noteDown(note, isSharp, NodeID) {

    const elem = document.querySelector(`[data-note="${note}"]`);
    if (elem) {
        event.stopPropagation();
        elem.style.background = isSharp ? 'black' : '#ccc';
        var frequency = midiToFrequency(noteToMIDI(note))


        // Play the sound with the current gain
        playSound(frequency, NodeID);
        const event = new CustomEvent("noteDown", {
            detail: { message: "NoteDown" }
        });
        document.dispatchEvent(event);
    }

}

function midiToFrequency(midiValue) {
    return Math.pow(2, (midiValue - 69) / 12) * 440; //midi to frequency coversion
}


function playSound(frequency, NodeID) {
    const gainModifer = 20; //divides result to keep gain in an appropriate range, can be configured to change the maximum possible gain -> MaxGain = 100/gainModifier
    oscillatorGain.gain.value = document.getElementById(NodeID + '-gain').value / gainModifer;
    if (activeFrequency) {
        activeSource.frequency.setValueAtTime(frequency, ctx.currentTime);
    } else {
        activeSource.frequency.value = frequency
        activeSource.start();

    }
    activeFrequency = frequency;
}

function removeOptions(selectElement) {
    var i, L = selectElement.options.length - 1;
    for (i = L; i >= 0; i--) {
        selectElement.remove(i);
    }
}


function noteToMIDI(noteName) {
    const semitoneMap = {
        'C': 0, 'C#': 1, 'Db': 1, 'D': 2, 'D#': 3, 'Eb': 3, 'E': 4,
        'F': 5, 'F#': 6, 'Gb': 6, 'G': 7, 'G#': 8, 'Ab': 8, 'A': 9,
        'A#': 10, 'Bb': 10, 'B': 11
    };
    const MIDI_OCTAVE_OFFSET = 1;
    const semitonesInOctave = 12;
    noteName = noteName.trim();


    const noteComponents = noteName.match(/^([A-Ga-g])([#b]?)([0-9]+)$/);
    if (!noteComponents) {
        throw new Error('Invalid note name format');
    }
    const note = noteComponents[1].toUpperCase() + noteComponents[2];
    const octave = parseInt(noteComponents[3]);
    if (octave < -1 || octave > 9) {
        throw new Error('Octave out of valid MIDI range (-1 to 9)');
    }

    if (semitoneMap.hasOwnProperty(note)) {
        // Calculate the MIDI note number based on A440 tuning.
        return semitoneMap[note] + (octave + MIDI_OCTAVE_OFFSET) * semitonesInOctave; // A440 = MIDI note 69
    } else {
        throw new Error('Invalid note name');
    }
}


export function updateActiveNodes(Nodes, NodeID) {
    activeNodes = Nodes;
    var selectConnection = document.getElementById(NodeID + '-connection');
    console.log(selectConnection)
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


