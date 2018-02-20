/*
 Use this to load plugin info from approvedPlugins/
 */

function getInformation() {
    var pluginLocation = window.location.href.split("?loc=")[1];
    firebase.database().ref(pluginLocation).once("value").then(function(data) {
        var plInfo = data.val();
        $("#plugin-title").html(plInfo.pluginName);
        $("#plugin-desc").html(plInfo.pluginDesc);
        $("#plugin-dl").html("<a href=\"" + plInfo.downloadUrl + "\">Download</a>");
        $("#plugin-info").html(plInfo.pluginInfo);
        $("#plugin-author").html(plInfo.pluginAuthor);
        $("#plugin-tags").html(arrayToStr(plInfo.pluginTags));
    });
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