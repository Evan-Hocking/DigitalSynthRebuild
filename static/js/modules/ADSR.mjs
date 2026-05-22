export function createADSR(ctx, audioParam, UIContainer) {
    
    function buildUI() {

    }

    function updateADSR() {

    }

    function deleteEnvelope() {

    }
    function noteDown(e) {
        console.log(e.detail.message);
    }

    function noteUp() {

    }


    document.addEventListener("noteDown", (e) => {
        noteDown(e)
    });

}