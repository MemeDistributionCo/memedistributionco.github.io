/*
 Use this to load plugin info from approvedPlugins/
 */

function getInformation() {
    var pluginLocation = window.location.href.split("?loc=")[1];
    firebase.database().ref(pluginLocation).once("value").then(function(data) {
        var plInfo = data.val();
        var showdownConverter = new showdown.Converter();
        $("#plugin-title").html(plInfo.pluginName);
        $("#plugin-desc").html(plInfo.pluginDesc);
        $("#plugin-dl").html("<a href=\"" + plInfo.downloadUrl + "\">Download</a>");
        $("#plugin-info").html(showdownConverter.makeHtml(fixPluginInfo(plInfo.pluginInfo)));
        $("#plugin-author").html(plInfo.pluginAuthor);
        $("#plugin-tags").html(arrayToStr(plInfo.pluginTags));
    });
}


function fixPluginInfo(infoStr) {
    while(infoStr.includes("&#96;")) {
        var index = infoStr.indexOf("&#96;");
        var newText = infoStr.substr(0,index);
        newText+="`";
        newText+=infoStr.substr(index+5);
        infoStr = newText;
    }
    
    while(infoStr.includes("&lt;")) {
        var index = infoStr.indexOf("&lt;");
        var newText = infoStr.substr(0,index);
        newText+="<";
        newText+=infoStr.substr(index+4);
        infoStr = newText;
    }
    
    while(infoStr.includes("&gt;")) {
        var index = infoStr.indexOf("&gt;");
        var newText = infoStr.substr(0,index);
        newText+=">";
        newText+=infoStr.substr(index+4);
        infoStr = newText;
    }
    return infoStr;
}

function arrayToStr(arr) {
    var txt = "";
    for(var i = 0; i < arr.length; i++) {
        txt+=arr[i];
        if(i != arr.length-1) {
            txt+=", ";
        }
    }
    return txt;
}