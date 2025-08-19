let activeNodes = {};
// import { ctx, removeActiveModule } from '../script.mjs';
let removeActiveModule;
let ctx
export function init(Nodes, NodeID, audioCtx, RemActMod) {
    ctx = audioCtx;
    removeActiveModule = RemActMod;
    let splitterNode = ctx.createChannelMerger(2);
    activeNodes = Nodes;
    buildUI(splitterNode,NodeID);
    return splitterNode;
}

function removeOptions(selectElement) {
   var i, L = selectElement.options.length - 1;
   for(i = L; i >= 0; i--) {
      selectElement.remove(i);
   }
}

export function updateActiveNodes(Nodes, NodeID){
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

function buildUI(Node,NodeID){
    var modulePanel = document.getElementById('module-panel');
    var SplitControls = document.createElement('div');
    SplitControls.id = NodeID + '-Controls';
    
    SplitControls.className = 'module';
    SplitControls.classList.add("module-box")
    modulePanel.appendChild(SplitControls);
    var moduleTitle = document.createElement('h2');
    moduleTitle.innerHTML = NodeID;
    SplitControls.appendChild(moduleTitle);

    var selectConnection1 = document.createElement('select');
    selectConnection1.id = NodeID + '-1-connection';
    var options = Object.keys(activeNodes);
    var opt = document.createElement('option');
    opt.value = '';
    opt.disabled = true;
    opt.selected = true;
    opt.text = 'Select';
    selectConnection1.appendChild(opt);
    options.forEach(function (option) {
        opt = document.createElement('option');
        opt.value = option;
        opt.text = option.charAt(0).toUpperCase() + option.slice(1);
        selectConnection1.appendChild(opt);
    });
    selectConnection1.addEventListener('change', function (event) {
        const selectedNode = event.target.value;
        const selectedNodeValue = activeNodes[selectedNode]['node'];
        //Node.disconnect();
        Node.connect(selectedNodeValue,0);
        selectConnection1.blur()
    });

  var selectConnectionLabel1 = document.createElement('label');
    selectConnectionLabel1.innerHTML = 'Connect to';
    selectConnectionLabel1.setAttribute('for', NodeID + '-1-connection');
    SplitControls.appendChild(selectConnectionLabel);
    SplitControls.appendChild(selectConnection);
    var remove = document.createElement('button')
        remove.innerHTML = "Remove"
        remove.addEventListener('click', function (event){
            SplitControls.remove()
            removeActiveModule(NodeID)
        })
        SplitControls.appendChild(remove)
    
    var selectConnection2 = document.createElement('select');
    selectConnection1.id = NodeID + '-2-connection';
    var options = Object.keys(activeNodes);
    var opt = document.createElement('option');
    opt.value = '';
    opt.disabled = true;
    opt.selected = true;
    opt.text = 'Select';
    selectConnection2.appendChild(opt);
    options.forEach(function (option) {
        opt = document.createElement('option');
        opt.value = option;
        opt.text = option.charAt(0).toUpperCase() + option.slice(1);
        selectConnection2.appendChild(opt);
    });
    selectConnection2.addEventListener('change', function (event) {
        const selectedNode = event.target.value;
        const selectedNodeValue = activeNodes[selectedNode]['node'];
        //gainNode.disconnect();
        Node.connect(selectedNodeValue,1);
        selectConnection2.blur()
    });
  var selectConnectionLabel = document.createElement('label');
    selectConnectionLabel.innerHTML = 'Connect to';
    selectConnectionLabel.setAttribute('for', NodeID + '-connection');
    SplitControls.appendChild(selectConnectionLabel);
    SplitControls.appendChild(selectConnection);
    var remove = document.createElement('button')
        remove.innerHTML = "Remove"
        remove.addEventListener('click', function (event){
            SplitControls.remove()
            removeActiveModule(NodeID)
        })
        SplitControls.appendChild(remove)
    
    



}
