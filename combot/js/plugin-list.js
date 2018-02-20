

function listPlugins() {
    firebase.database().ref("approvedPlugins").once("value").then(function(data) {
        var pluginMap = data.val();
        var htmlFin = "";
        for(var key in pluginMap) {
            var plugin = pluginMap[key];
            htmlFin+="<div class=\"row plugin-item\">";
            
            htmlFin+="<div class=\"col-2\">";
            htmlFin+="<a href=\"/plugin-display-page.html?loc=approvedPlugins/" + key + "\">" + plugin.pluginName + "</a>";
            htmlFin+="</div>";
            
            htmlFin+="<div class=\"col-6\">";
            htmlFin+=plugin.pluginDesc;
            htmlFin+="</div>";
            
            htmlFin+="<div class=\"col-4\">";
            htmlFin+=arrayToStr(plugin.pluginTags);
            htmlFin+="</div>";
            
            htmlFin+="</div>";
        }
        $("#plugin-list").html(htmlFin);
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