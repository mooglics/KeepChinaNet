// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const ipcRenderer = require('electron').ipcRenderer;

const remote = require('electron').remote;

var $ = jQuery


ipcRenderer.on('online-status-changed', function(event, status) {
    console.log("收到在线/离线状态的变化通知 %s", status);
    if (status == 'OK') {
        $("#online_span").removeClass("label-default")
        $("#online_span").addClass("label-success")
    } else {
        $("#online_span").removeClass("label-success")
        $("#online_span").addClass("label-default")
    }

});

$("#saveBtn").on("click", function() {
    console.log("本地保存账号为：%s,%s", $("#chinanet-id").val(), $("#chinanet-pwd").val());
    window.localStorage.setItem("chinanet-id", $("#chinanet-id").val());
    window.localStorage.setItem("chinanet-pwd", $("#chinanet-pwd").val());
})


$("#chinanet-id").val(window.localStorage.getItem("chinanet-id"))
$("#chinanet-pwd").val(window.localStorage.getItem("chinanet-pwd"))
