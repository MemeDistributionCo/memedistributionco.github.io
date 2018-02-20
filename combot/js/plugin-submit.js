$(document).ready(function(f) {
    $("#plform").submit(function(e) {
        e.preventDefault();   
    });
    firebase.auth().onAuthStateChanged(function(user) {
        if(user) {
            //logged in
            $("#login-out").html("<button onclick=\"logout()\">Logout</button> You are currently logged in");
        } else {
            $("#login-out").html("<button onclick=\"login()\">Login</button> You must log in to submit a plugin.");
        }
    });
});

//jQuery required thx
function submitPlugin() {
    var form = $("#plform");
    var formVerified = verifyForm();
    if(formVerified) {
        alert("Starting upload");
        uploadForm();
    } else {
        alert("The form is invalid, please try to fix any mistakes present");
    }
}

function getTags() {
    var tags = [];
    var tagBoxes = $("input[name='tags']");
    for(var i = 0; i < tagBoxes.length; i++) {
        if(tagBoxes[i].checked) {
            tags.push($(tagBoxes[i]).val());
        }
    }
    if(tags.length == 0) {
        tags = ["misc"];
    }
    return tags;
}

function fixText(text) {
    while(text.indexOf('<') != -1) {
        var index = text.indexOf('<');
        var newText = text.substr(0,index);
        newText+="&lt;";
        newText+=text.substr(index+1);
        text = newText;
        console.log(text);
    }
    
    while(text.indexOf('>') != -1) {
        var index = text.indexOf('>');
        var newText = text.substr(0,index);
        newText+="&gt;";
        newText+=text.substr(index+1);
        text = newText;
    }
    
    while(text.indexOf('`') != -1) {
        var index = text.indexOf('`');
        var newText = text.substr(0,index);
        newText+="&#96;";
        newText+=text.substr(index+1);
        text = newText;
    }
    return text;
}

function uploadForm() {
    firebase.auth().onAuthStateChanged(function(user) {
        if(user) {
            //Logged in
            var plName = $("#plname").val();
            var plDesc = $("#pldesc").val();
            var plInfo = $("#plinfo").val();
            plInfo = fixText(plInfo);
            var file = $("#jarfile")[0].files[0];
            if(file.size/1024/1024 > 2) {
                alert("File too large. Send me a message and we can talk about it");
                return;
            }
            /*var formData = new FormData();
            formData.append('file',file);
            formData.append('plname',plName);
            formData.append('pldesc', plDesc);
            formData.append('plinfo', plInfo);*/
            var finPath = "userPlugins/" + user.uid + "/plugins/" + plName + "/" + file.name;
            var ref = firebase.storage().ref(finPath);
            ref.put(file).then(function(snap) {
                alert("Upload complete");
                ref.getDownloadURL().then(function(url) {
                    //alert("URL!: " + url);
                    tags = getTags();
                    
                    firebase.database().ref(finPath.replace(file.name, "")).set({
                        downloadUrl:url,
                        pluginName:plName,
                        pluginDesc:plDesc,
                        pluginInfo:plInfo,
                        pluginTags:tags
                    }).then(function(fin) {
                        alert("Plugin set to pending!");
                        location.reload();
                    }).catch(function(err) {
                        alert("Failed to update plugin status, send me a message");  
                    });
                    
                });
                //location.reload();
                //var dbRef = firebase.database().ref("plugins/pending/"+user.uid+"/"+plName);
                //dbRef.set({
                //    downloadLink:
                //});
            }).catch(function(err) {
                alert("Failed to upload plugin, is it too big? (size>2MB) Either way, send me a message");
                location.reload();
            });
        } else {
            alert("You have to be logged in to do this");
        }
    });
}

function login() {
    var loginProvider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(loginProvider).then(function(x) {
        if(x) {
            location.reload();
        }
    });
}

function logout() {
    firebase.auth().signOut().then(function() {
        location.reload();
    }).catch(function(err) {
        alert("Failed to sign out?? " + err);
        location.reload();
    });
}

function verifyForm() {
    var plName = $("#plname").val();
    var plDesc = $("#pldesc").val();
    var plInfo = $("#plinfo").val();
    var file = $("#jarfile")[0].files[0];
   /*
    alert(plName);
    alert(plDesc);
    alert(plInfo);
    alert(file);*/
    if(plName.trim() !== "" && plDesc.trim() !== "" && plInfo.trim() !== "" && file != null) {
        return true;
    } else {
        return false;
    }
}