let activeNodes = {};
let removeActiveModule;
let ctx

export function init(Nodes, NodeID, audioCtx, RemActMod) {
    ctx = audioCtx;
    removeActiveModule = RemActMod;
    let splitterNode = ctx.createGain();
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

    const SplitterNumberOfOutputs = document.createElement('input');
    SplitterNumberOfOutputs.id = NodeID + '-ConnectionNumber';
    SplitterNumberOfOutputs.type = "number";
    SplitterNumberOfOutputs.name = NodeID + '-ConnectionNumber';
    SplitterNumberOfOutputs.min = "1";
    SplitterNumberOfOutputs.max = "8"
    SplitterNumberOfOutputs.value = "2";

    SplitterNumberOfOutputs.addEventListener('change', function (event) {
        const currentSplitterOutputs = document.getElementById(NodeID + "-outputSelectors")
        currentSplitterOutputs.remove()
        buildSelectors()
    });

    var SplitterNumberOfOutputsLabel = document.createElement('label');
    SplitterNumberOfOutputsLabel.innerHTML = 'Number of Outputs';
    SplitterNumberOfOutputsLabel.setAttribute('for', NodeID + '-ConnectionNumber');
    SplitControls.appendChild(SplitterNumberOfOutputsLabel);
    SplitControls.appendChild(SplitterNumberOfOutputs);

    buildSelectors();



    var remove = document.createElement('button')
    remove.innerHTML = "Remove"
    remove.addEventListener('click', function (event) {
        SplitControls.remove()
        removeActiveModule(NodeID)
    })
    SplitControls.appendChild(remove)



    function buildSelectors() {
        const splitterOutputs = document.createElement('div')
        splitterOutputs.id = NodeID + "-outputSelectors"
        SplitControls.appendChild(splitterOutputs)

        var options = Object.keys(activeNodes);
        const splitterConnections = {};
        for (let i = 1; i <= SplitterNumberOfOutputs.value; i++) {
            var container = document.createElement('div');
            splitterConnections["Connection" + i] = null;
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
                splitterConnections["Connection" + i] = selectedNodeValue;
                connectNodes();
                selectConnection.blur();
            });

            // Add label and select to container
            var selectConnectionLabel = document.createElement('label');
            selectConnectionLabel.innerHTML = 'Connect to';
            selectConnectionLabel.setAttribute('for', NodeID + '-' + i + '-connection');
            container.appendChild(selectConnectionLabel);
            container.appendChild(selectConnection);
            splitterOutputs.appendChild(container);
        }
        function connectNodes() {
            Node.disconnect()
            var connectionKeys = Object.keys(splitterConnections);
            connectionKeys.forEach(function (connectionKey) {
                const targetModule = splitterConnections[connectionKey];
                if (!targetModule) return;
                Node.connect(targetModule)
            });
        }
    }

}
