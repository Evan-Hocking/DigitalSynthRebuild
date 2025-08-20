let activeNodes = {};
let removeActiveModule;
let ctx

export function init(Nodes, NodeID, audioCtx, RemActMod) {
    ctx = audioCtx;
    removeActiveModule = RemActMod;
    let splitterNode = ctx.createChannelMerger(2);
    activeNodes = Nodes;
    buildUI(splitterNode, NodeID);
    return splitterNode;
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
    var options = Object.keys(activeNodes);


    for (let i = 1; i <= 2; i++) {
        var opt = document.createElement('option');
        opt.value = '';
        opt.disabled = true;
        opt.selected = true;
        opt.text = 'Select';
        var selectConnection = document.getElementById(NodeID + '-' + i + '-connection');
        removeOptions(selectConnection);

        selectConnection.appendChild(opt);
        options.forEach(function (option) {
            var opt = document.createElement('option');
            opt.value = option;
            opt.text = option.charAt(0).toUpperCase() + option.slice(1);
            selectConnection.appendChild(opt);
        });
    }
}

function buildUI(Node, NodeID) {
    var modulePanel = document.getElementById('module-panel');
    var SplitControls = document.createElement('div');
    SplitControls.id = NodeID + '-Controls';

    SplitControls.className = 'module';
    SplitControls.classList.add("module-box")
    modulePanel.appendChild(SplitControls);
    var moduleTitle = document.createElement('h2');
    moduleTitle.innerHTML = NodeID;
    SplitControls.appendChild(moduleTitle);


    var options = Object.keys(activeNodes);

    for (let i = 1; i <= 2; i++) {
        // Create select element directly
        var selectConnection = document.createElement('select');
        selectConnection.id = NodeID + '-' + i + '-connection';

        // Placeholder option
        var placeholderOpt = document.createElement('option');
        placeholderOpt.value = '';
        placeholderOpt.disabled = true;
        placeholderOpt.selected = true;
        placeholderOpt.text = 'Select';
        selectConnection.appendChild(placeholderOpt);

        // Add dynamic options
        options.forEach(function (option) {
            var opt = document.createElement('option');
            opt.value = option;
            opt.text = option.charAt(0).toUpperCase() + option.slice(1);
            selectConnection.appendChild(opt);
        });

        // Add event listener
        selectConnection.addEventListener('change', function (event) {
            const selectedNode = event.target.value;
            const selectedNodeValue = activeNodes[selectedNode]['node'];
            Node.disconnect();
            Node.connect(selectedNodeValue);
            selectConnection.blur();
        });

        // Add label and select to container
        var selectConnectionLabel = document.createElement('label');
        selectConnectionLabel.innerHTML = 'Connect to';
        selectConnectionLabel.setAttribute('for', NodeID + '-' + i + '-connection');
        SplitControls.appendChild(selectConnectionLabel);
        SplitControls.appendChild(selectConnection);
    }

    var remove = document.createElement('button')
    remove.innerHTML = "Remove"
    remove.addEventListener('click', function (event) {
        SplitControls.remove()
        removeActiveModule(NodeID)
    })
    SplitControls.appendChild(remove)





}
