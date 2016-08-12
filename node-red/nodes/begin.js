module.exports = function(RED) {
    "use strict";
    function BeginNode(n) {
        RED.nodes.createNode(this,n);
    }
    RED.nodes.registerType("Begin",BeginNode);
}
