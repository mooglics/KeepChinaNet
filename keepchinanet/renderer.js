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

$("#actionBtn").on("click", function() {
    main();
})


$(document).ready(function() {
    $("#chinanet-id").val(window.localStorage.getItem("chinanet-id"))
    $("#chinanet-pwd").val(window.localStorage.getItem("chinanet-pwd"))
});





//引入核心包
var path = require('path');
var fs = require('fs');
var util = require('util');
//引入第三方包
var moment = require('moment');
moment.locale('zh-CN');
var async = require('async');
//引入request并启用Cookie
var request = require('request').defaults({
    jar: true
});
var us = require('underscore');
var CronJob = require('cron').CronJob;

//定义全局常量
var WAP_163 = 'http://wap.163.com/index.jsp?r=' + Math.random();
var http_def = {
    method: 'POST',
    rejectUnauthorized: false,
    headers: {
        'User-Agent': 'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; .NET CLR 2.0.50727; MAXTHON 2.0)',
        'Content-Type': 'application/x-www-form-urlencoded'
    }
};
var j = request.jar();
var INDEX_OPT = {
    uri: 'https://wlan.ct10000.com/portal/index.do?NasType=Huawei&NasName=BJ-DS-SR-1.M.ME60',
    jar: j
};
var DWR_OPT = {
    method: 'POST',
    rejectUnauthorized: false,
    headers: {
        'User-Agent': 'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; .NET CLR 2.0.50727; MAXTHON 2.0)',
        'Content-Type': 'text/plain'
    },
    uri: 'https://wlan.ct10000.com/portal/dwr/call/plaincall/__System.generateId.dwr',
    jar: j,
    body: 'callCount=1\rc0-scriptName=__System\rc0-methodName=generateId\rc0-id=0\rbatchId=0\rinstanceId=0\rpage=%2Fportal%2Findex.do%3FNasType%3DHuawei%26NasName%3DBJ-DS-SR-1.M.ME60\rscriptSessionId=\rwindowName='
};
var LOGOUT_OPT = {
    method: 'POST',
    uri: 'https://wlan.ct10000.com/portal/Logout.do?NasType=Huawei&NasName=BJ-DS-SR-1.M.ME60'
}
var LOGIN_STR = 'username=!1!&password=!2!&validateCode=&postfix=%40wlan.bj.chntel.com&address=bj&loginvalue=1&basePath=https%3A%2F%2Fwlan.ct10000.com%3A443%2Fportal%2F&language=CN_SC&longNameLength=32&NasType=Huawei&NasName=BJ-DS-SR-1.M.ME60&OrgURL=null&isMobileRand=false&isNeedValidateCode=false&phone=&pwd_phone=!2!&validateCode_phone=&otherUser=!1!&address1=bj&otherUserPwd=!2!&validateCode_otherUser=&select2=-Select+Service+Provider-';
var LOGIN_OPT = {
    uri: 'https://wlan.ct10000.com/portal/login4V2.do',
    jar: j,
    body: ''
};

function main() {
    LOGIN_STR = LOGIN_STR.replace(/!1!/g, $("#chinanet-id").val());
    LOGIN_STR = LOGIN_STR.replace(/!2!/g, $("#chinanet-pwd").val());
    LOGIN_OPT.body = LOGIN_STR;
    async.waterfall([
        step1,
        step2
    ], function(err, result) {
        if (err) {
            util.log(err);
        } else {
            util.log(result);
        }
    });
}

function step1(cb) {
    request(WAP_163, function(error, res, body) {
        if (body && res.statusCode == 200 && body.indexOf("网易报时") != -1) {
            cb('网络正常');
        } else {
            util.log('网络不正常，需要重新联网');
            cb(null, 'do next');
        }
    });
}

function step2(result, cb) {
    util.log('准备重连网络');
    //先默认退出登录一下
    request(LOGOUT_OPT, function(error, res, body) {
        request(us.extend(INDEX_OPT, http_def), function(error, res, body) {
            if (res.statusCode == 200) {
                //准备获取DWRSESSIONID;
                request(DWR_OPT, function(error, res, body) {
                    console.log(error);
                    var dwrsid = body.match(/,"(.{27})\"/)[1];
                    console.log("获取sessionid,%s", dwrsid);
                    var domain = "https://wlan.ct10000.com";
                    j.setCookie('DWRSESSIONID=' + dwrsid + ';path=/portal;', domain);
                    request(us.extend(LOGIN_OPT, http_def), function(error1, res1, body1) {
                        util.log(body1.indexOf('"1" == "1" \)//登录成功'));
                        request(WAP_163, function(error, res, body) {
                            if (body && res.statusCode == 200 && body.indexOf("网易报时") != -1) {
                                cb('登录成功，可以使用网络了');
                            } else {
                                cb('网络仍然不正常');
                            }
                        });
                    });
                });
            }
        });
    });

}

var keepJob = new CronJob("*/10 * * * * *", function() { main(); });
