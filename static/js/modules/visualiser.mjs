let activeNodes = {};

let removeActiveModule
let ctx;

export function init(Nodes, NodeID, audioCtx, RemActMod) {
    ctx = audioCtx;
    removeActiveModule = RemActMod;
    let Node = ctx.createAnalyser(); //Set to module type
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
    buildControlUI(Node, NodeID)
    buildVisualiser(Node)
}


function buildControlUI(Node, NodeID) {
    var modulePanel = document.getElementById('module-panel');
    var NodeControls = document.createElement('div');
    NodeControls.id = NodeID + '-Controls';

    NodeControls.className = 'module';
    NodeControls.classList.add("module-box")
    modulePanel.appendChild(NodeControls);
    var moduleTitle = document.createElement('h2');
    moduleTitle.innerHTML = NodeID;
    NodeControls.appendChild(moduleTitle);




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

function buildVisualiser(Node) {
    Node.smoothingTimeConstant = 0.9; // Set the smoothing time constant
    Node.fftSize = 2048;
    const dataArray = new Uint8Array(Node.frequencyBinCount);
    const canvas = document.getElementById("canvas");
let c = buildCanvas();



    window.addEventListener('resize', () => {
        c = buildCanvas();
    });


    const canvas = document.getElementById("canvas")

    function buildCanvas() {
        var c = canvas.getContext("2d");

        function resizeCanvas() {
            canvas.width = window.innerWidth; // Set canvas width to window inner width
            canvas.height = 200; // Set canvas height (you can adjust this as needed)

            const pixelRatio = window.devicePixelRatio || 1; // Get the device pixel ratio
            canvas.width *= pixelRatio; // Scale canvas width by pixel ratio
            canvas.width -= 10;
            canvas.height *= pixelRatio; // Scale canvas height by pixel ratio

            canvas.style.width = (canvas.width / pixelRatio) - 10 + "px"; // Set canvas CSS width
            canvas.style.height = canvas.height / pixelRatio + "px"; // Set canvas CSS height

            c.fillStyle = "#181818";
            c.fillRect(0, 0, canvas.width, canvas.height);
            c.strokeStyle = "var(--Primary);";
            c.beginPath();
            c.moveTo(0, canvas.height / 2);
            c.lineTo(canvas.width, canvas.height / 10);
            c.stroke();
        }

        // Initial call to resizeCanvas
        resizeCanvas();

        // Add event listener for window resize event
        window.addEventListener('resize', resizeCanvas);

        // Return the canvas context
        return c;
    }


    const draw = (analyser, dataArray, c) => {

        analyser.getByteTimeDomainData(dataArray);
        const segmentWidth = canvas.width / analyser.frequencyBinCount;
        c.fillRect(0, 0, canvas.width, canvas.height);
        c.beginPath();
        c.moveTo(-100, canvas.height / 2);

        for (let i = 1; i < analyser.frequencyBinCount; i += 1) {
            let x = i * segmentWidth;
            let v = dataArray[i] / 128.0;
            let y = (v * canvas.height) / 2;
            c.lineTo(x, y);
        }

        c.lineTo(canvas.width + 100, canvas.height / 2);
        c.stroke();
        requestAnimationFrame(() => draw(analyser, dataArray, c));

    };
    draw(Node, dataArray, c)
}