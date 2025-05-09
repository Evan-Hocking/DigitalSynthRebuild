const serverUrl = window.location.origin;
const ctx = new (window.AudioContext || window.webkitAudioContext)();
const sampleRate = ctx.sampleRate;

let activeKey = null;
let activeFrequency = null;
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
            whitekey = document.createElement('div');
            whitekey.className = 'whitenote';
            whitekey.dataset.note = note + (octave + 4);
            whitekey.id = note + (octave + 4);
            


            // html += `<div class='whitenote'
            // data-note='${note + (octave + 4)}' id = '${note + (octave + 4)}'>`;
            
            
            //generates black note
            if (hasSharp) {
                blackkey = document.createElement('div');
                blackkey.className = 'blacknote';
                blackkey.dataset.note = note + '#' + (octave + 4);
                blackkey.id = note + '#' + (octave + 4);
                whitekey.appendChild(blackkey);


            //     html += `<div class='blacknote'

            // data-note='${note + '#' + (octave + 4)}' id = '${note + '#' + (octave + 4)}'></div>`;
            }
            // html += '</div>';
            keys.appendChild(whitekey);
        }
    }

    // document.getElementById('controller-panel').innerHTML = html;
    controllerPanel.appendChild(keys);

    

}
buildKeys()





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
    // if (activeKeys) {
    //     noteDown(keyNoteMapping[activeKeys[0]],)
    // }
});

// #endregion

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

function noteUp(note, isSharp) {
  
    const elem = document.querySelector(`[data-note="${note}"]`);
    elem.style.background = isSharp ? '#292929' : 'white';
    
    if (activeKeys[0]) {
        noteDown(keyNoteMapping[activeKeys[activeKeys.length - 1]],)
    } else {
        var now = ctx.currentTime;
        
        activeSource.stop(now)
        activeSource.disconnect();
        
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
    let activeSource = ctx.createOscillator();
    activeSource.connect(ctx.destination);

    // if (activeFrequency) {
    //     activeSource.frequency.setValueAtTime(frequency, ctx.currentTime);
    // } else {
        // const nodeKeys = Object.keys(activeFilters);
        // const filterKeys = nodeKeys.map(str => str.replace(/\d+$/, ''));

        // for (let i = 1; i < filterKeys.length; i++) {
        //     availableFilters[filterKeys[i]].updateParam(activeFilters[nodeKeys[i]], nodeKeys[i], ctx)

        // }
        // Create an oscillator node
        // const osc = ctx.createOscillator();
        // activeSource.type = document.getElementById("waveform").value
        console.log(frequency)
        activeSource.frequency.value = frequency
        // Start and stop the oscillator after a short duration (adjust as needed)

        activeFrequency = frequency;
        activeSource.start();



        // Store the active source
        // activeSource = osc;
    // }
    

}