function buildKeys() {
    var notes = ['C', 'D', 'E', 'F', 'G', 'A', 'B']
    var html = "";
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
            html += `<div class='whitenote'
            data-note='${note + (octave + 4)}' id = '${note + (octave + 4)}'>`;
            //generates black note
            if (hasSharp) {
                html += `<div class='blacknote'

            data-note='${note + '#' + (octave + 4)}' id = '${note + '#' + (octave + 4)}'></div>`;
            }
            html += '</div>';
        }
    }

    document.getElementById('controller-panel').innerHTML = html;

    

}