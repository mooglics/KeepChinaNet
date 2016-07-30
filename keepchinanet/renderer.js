// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const ipcRenderer = require('electron').ipcRenderer;

const remote = require('electron').remote;

var $ = jQuery


ipcRenderer.on('online-status-changed', function(event, status) {
  console.log("收到在线/离线状态的变化通知 %s",status);
  if (status == 'online') {
  $("#online_span").removeClass("label-default")
  $("#online_span").addClass("label-success")
  } else {
  $("#online_span").removeClass("label-success")
  $("#online_span").addClass("label-default")
  }

});
