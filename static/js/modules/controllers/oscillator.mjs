import { ctx } from '../../script.mjs';
let activeKey = null;
let activeFrequency = null;

let activeSource = null;
let oscillatorGain = null;

let activeNodes = {};

export function updateActiveNodes(Nodes) {
    activeNodes = Nodes;
    var selectConnection = document.getElementById('osc-connection');
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


const activeKeys = []
const keyNoteMapping = {
    'tab': 'C4',
    '1': 'C#4',
    'q': 'D4',
    '2': 'D#4',
    'w': 'E4',
    'e': 'F4',
    '4': 'F#4',
    'r': 'G4',
    '5': 'G#4',
    't': 'A4',
    '6': 'A#4',
    'y': 'B4',
    'u': 'C5',
    '8': 'C#5',
    'i': 'D5',
    '9': 'D#5',
    'o': 'E5',
    'p': 'F5',
    '-': 'F#5',
    '[': 'G5',
    '=': 'G#5',
    ']': 'A5',
    'backspace': 'A#5',
    'enter': 'B5',

    // Add more keys as needed
};
export function init(Nodes, id) {

    activeNodes = Nodes;
    activeSource = ctx.createOscillator();
    oscillatorGain = ctx.createGain();
    oscillatorGain.gain.value = 0;
    activeSource.connect(oscillatorGain);
    buildUI(id);
    return oscillatorGain;
}
function buildUI(id) {
    // Create the controller panel
    var modulePanel = document.getElementById('module-panel');
    var oscilattorControls = document.createElement('div');
    oscilattorControls.id = id + '-controls';
    oscilattorControls.className = 'module';
    modulePanel.appendChild(oscilattorControls);
    var moduleTitle = document.createElement('h2');
    moduleTitle.innerHTML = id;
    oscilattorControls.appendChild(moduleTitle);


    var WaveformSelect = document.createElement('select');
    WaveformSelect.id = 'waveform-select';
    var waveforms = ['sine', 'square', 'sawtooth', 'triangle'];
    waveforms.forEach(function (waveform) {
        var option = document.createElement('option');
        option.value = waveform;
        option.text = waveform.charAt(0).toUpperCase() + waveform.slice(1);
        WaveformSelect.appendChild(option);
    });
    WaveformSelect.addEventListener('change', function (event) {
        const selectedWaveform = event.target.value;
        activeSource.type = selectedWaveform;
        WaveformSelect.blur()
    });
    oscilattorControls.appendChild(WaveformSelect);
    var WaveformLabel = document.createElement('label');
    WaveformLabel.innerHTML = 'Waveform';
    WaveformLabel.setAttribute('for', 'waveform-select');
    oscilattorControls.appendChild(WaveformLabel);


    var gain = document.createElement('input');
    gain.type = 'range';
    gain.id = 'oscillator-gain';
    gain.min = 0;
    gain.max = 100;
    gain.value = 50;
    oscilattorControls.appendChild(gain);
    var gainLabel = document.createElement('label');
    gainLabel.innerHTML = 'Gain';
    gainLabel.setAttribute('for', 'gain');
    oscilattorControls.appendChild(gainLabel);

    var selectConnection = document.createElement('select');
    selectConnection.id = 'osc-connection';
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
        console.log('active nodes:', activeNodes);
        console.log('Selected node:', selectedNode);
        console.log('Selected node Value:', selectedNodeValue);
        oscillatorGain.disconnect();
        oscillatorGain.connect(selectedNodeValue);
        selectConnection.blur()
    });
    oscilattorControls.appendChild(selectConnection);

    buildKeys();
}
function buildKeys() {
    var notes = ['C', 'D', 'E', 'F', 'G', 'A', 'B']
    var controllerPanel = document.getElementById('controller-panel');


    var keys = document.createElement('div');
    keys.id = 'keys';


    // var html = "";
    for (var octave = 0; octave < 2; octave++) {
        //generates whole object
        for (var i = 0; i < notes.length; i++) {
            var hasSharp = true;
            var note = notes[i];
            //tests if note has accomanying sharp
            if (note == 'E' || note == 'B') {
                hasSharp = false;
            }

            //generates white note
            var whitekey = createKey("whitenote", note + (octave + 4))
            //generates black note
            if (hasSharp) {
                var blackkey = createKey("blacknote", note + '#' + (octave + 4))
                whitekey.appendChild(blackkey);
            }
            keys.appendChild(whitekey);
        }
    }
    // document.getElementById('controller-panel').innerHTML = html;
    controllerPanel.appendChild(keys);
}

function createKey(keyClass, note) {
    var key = document.createElement('div')
    key.className = keyClass
    key.dataset.note = note
    key.id = note

    key.addEventListener('mousedown', function (event) {
        noteDown(this.dataset.note, this.dataset.note.includes('#'))
    })
    key.addEventListener('mouseup', function (event) {
        noteUp(this.dataset.note, this.dataset.note.includes('#'))
    })
    key.addEventListener('mouseout', function (event) {
        noteUp(this.dataset.note, this.dataset.note.includes('#'))
    })
    return key
}


// #region keyEventListeners
//Event listener for the keydown event
document.addEventListener('keydown', function (event) {
    //prevents default tab behaviour since it is used for keyboard input
    if (event.key === 'Tab') {
        event.preventDefault();
    }
    const keyPressed = event.key.toLowerCase();

    //tests if key is already playing



    // Check if the pressed key is in the mapping
    if (keyNoteMapping.hasOwnProperty(keyPressed)) {
        if (!activeKeys.includes(keyPressed)) {
            activeKeys.push(keyPressed);
            const note = keyNoteMapping[keyPressed];


            //calling notedown to start sequence
            noteDown(note, "1234567890-=backspace`".includes(keyPressed) && keyPressed != "p" && keyPressed != "e");
        }
    }
});

//Event listenter for when a key is released
document.addEventListener('keyup', function (event) {
    const keyReleased = event.key.toLowerCase();
    const index = activeKeys.indexOf(keyReleased);

    // Check if the key is in the activeKeys array
    if (index !== -1) {
        activeKeys.splice(index, 1);
    }
    //tests if key is viable
    if (keyNoteMapping.hasOwnProperty(keyReleased)) {
        const note = keyNoteMapping[keyReleased];
        noteUp(note, "1234567890-=backspace`".includes(keyReleased) && keyReleased != "p" && keyReleased != "e");
    }
    //restarts original note if simultaneous notes played

});

// #endregion




function noteUp(note, isSharp) {

    const elem = document.querySelector(`[data-note="${note}"]`);
    elem.style.background = isSharp ? '#292929' : 'white';

    if (activeKeys[0]) {
        noteDown(keyNoteMapping[activeKeys[activeKeys.length - 1]],)
    } else {
        var now = ctx.currentTime;

        oscillatorGain.gain.value = 0;
    }


}

//controls behaviour for when a note is pressed
function noteDown(note, isSharp) {

    const elem = document.querySelector(`[data-note="${note}"]`);
    if (elem) {
        event.stopPropagation();
        elem.style.background = isSharp ? 'black' : '#ccc';
        var frequency = getFrequency(noteToMIDI(note))


        // Play the sound with the current gain
        playSound(frequency);
    }

}

function getFrequency(midiValue) {
    return Math.pow(2, (midiValue - 69) / 12) * 440;
}


function playSound(frequency) {
    oscillatorGain.gain.value = document.getElementById('oscillator-gain').value / 20;
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
    const noteMap = {
        'C': 0, 'C#': 1, 'Db': 1, 'D': 2, 'D#': 3, 'Eb': 3, 'E': 4,
        'F': 5, 'F#': 6, 'Gb': 6, 'G': 7, 'G#': 8, 'Ab': 8, 'A': 9,
        'A#': 10, 'Bb': 10, 'B': 11
    };

    const match = noteName.match(/^([A-Ga-g#]+)([0-9]+)$/);
    if (!match) {
        throw new Error('Invalid note name format');
    }

    const note = match[1].toUpperCase();
    const octave = parseInt(match[2]);

    if (noteMap.hasOwnProperty(note)) {
        // Calculate the MIDI note number based on A440 tuning.
        return noteMap[note] + (octave + 1) * 12; // A440 = MIDI note 69
    } else {
        throw new Error('Invalid note name');
    }
}