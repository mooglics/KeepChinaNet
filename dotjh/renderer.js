// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const ipcRenderer = require('electron').ipcRenderer;

const remote = require('electron').remote;

var $ = jQuery

var fs  =   require('fs');

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


$("#gen_btn").bind("click",function() {
  var sc_content = $("#dot_script").val();
  fs.existsSync('/tmp/dotgraph.png', (exists) => {
    if (exists) {
      console.log('删除png临时文件');
      fs.unlinkSync('/tmp/dotgraph.png');
    }
  });
  fs.writeFileSync('/tmp/dotgraph.dot', sc_content, 'utf-8','','w+');
  var exec = require('child_process').exec;
  var cmdStr = "dot -Tpng /tmp/dotgraph.dot -o /tmp/dotgraph.png";
  exec(cmdStr, function(err,stdout,stderr){
    if(err) {
      console.log('dot 命令执行失败:'+stderr);
    } else {
      console.log('正常生成');
    }
  });
  var buffer =  fs.readFileSync("/tmp/dotgraph.png");
  var content = buffer.toString("base64");
  $("#dot_view_panel").html("loading...");
  $("#dot_view_panel").html("<img src='data:image/png;base64,"+content+"' alt=''>");
});

//防止界面拖拽时产生弹出文件选择框事件
$(document).on({
      dragleave:function(e){    //拖离
        e.preventDefault();
      },
      drop:function(e){  //拖后放
        e.preventDefault();
      },
      dragenter:function(e){    //拖进
        e.preventDefault();
      },
      dragover:function(e){    //拖来拖去
        e.preventDefault();
      }
    });

$("#dot_script").bind("drop",function(event) {
  var fileList = event.originalEvent.dataTransfer;
  var filecontent = fs.readFileSync(fileList.files[0].path);
//console.log(filecontent);
$("#dot_script").val(filecontent);

});

