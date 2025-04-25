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
    console.log(keys);
    // document.getElementById('controller-panel').innerHTML = html;
    controllerPanel.appendChild(keys);

    

}
buildKeys()