
module.exports = function(RED) {
    "use strict";
    function EndNode(n) {
        RED.nodes.createNode(this,n);
    }
    RED.nodes.registerType("End",EndNode);
}
