//Arays that stores all the tracked domains


console.log('bg loaded');

let bgfnc = new backgroundFunctions();


//listens for change in checkmark on popup.html
// chrome.extension.onConnect.addListener(function(port) {
//     console.log("Connected .....");

//     port.onMessage.addListener(function(msg) {

//         port.postMessage("Hi Popufdp.js");
//         if (msg === "Record") {
//             console.log(msg);
//             recording = true;
//         } else if (msg === "Don't Record") {
//             console.log(msg);
//             recording = false;

//         }
//     });
// })

// if (recording) {


//triggers when url is changed on current tab

let updatedTab;

chrome.tabs.onUpdated.addListener(

    (tabId, changeinfo, tab) => {


        let URL = bgfnc.getHostName(tab.url);
        if (URL !== bgfnc.activeURL ) {
            window.clearInterval(updatedTab)
        }

        bgfnc.switchCurrentTab(URL);
        let currentTime = bgfnc.getCurrentTime(bgfnc.activeURL);
        console.log(`current time on url :${bgfnc.activeURL} is ${currentTime}`)
        bgfnc.currentTime = currentTime;
        if(bgfnc.activeURL!==undefined){
        	updatedTab = window.setInterval(function() { bgfnc.updateTime(bgfnc.activeURL, bgfnc.currentTime) }, 2000)
        }
        

    }
);

//Triggers when the user goes to a different tab in the same window
chrome.tabs.onActivated.addListener((tab) => {


    let id = tab.tabId;
    console.log('hello');
    chrome.tabs.get(id, (tab) => {

        let URL = bgfnc.getHostName(tab.url);
        console.log(bgfnc.activeURL);

        if (URL !== bgfnc.activeURL) {

            window.clearInterval(updatedTab)
        }

        bgfnc.switchCurrentTab(URL);
        let currentTime = bgfnc.getCurrentTime(bgfnc.activeURL);
        console.log(`current time on url :${bgfnc.activeURL} is ${currentTime}`)
        bgfnc.currentTime = currentTime;
        if (bgfnc.activeURL != undefined) {
            updatedTab = window.setInterval(function() { bgfnc.updateTime(bgfnc.activeURL, bgfnc.currentTime) }, 2000)
        }
    })
})


// Triggers when the user goes to a different chrome window
chrome.windows.onFocusChanged.addListener(

    function(windowId) {
        console.log('window changed');
        if (windowId == chrome.windows.WINDOW_ID_NONE) {

            //dont' record anything
            console.log('window no longer focused');
            console.log('here' + updatedTab);
            bgfnc.activeURL = undefined;
            window.clearInterval(updatedTab);

        } else {
            //record active tab on switched window
            console.log("here");
            chrome.tabs.query({ 'active': true, 'lastFocusedWindow': true }, function(tabs) {
                let URL = bgfnc.getHostName(tabs[0].url);


                if (URL !== bgfnc.activeURL) {
                    window.clearInterval(updatedTab)
                }

                bgfnc.switchCurrentTab(URL);
                let currentTime = bgfnc.getCurrentTime(bgfnc.activeURL);
                console.log(`current time on url :${bgfnc.activeURL} is ${currentTime}`)
                bgfnc.currentTime = currentTime;
                updatedTab = window.setInterval(function() { bgfnc.updateTime(bgfnc.activeURL, bgfnc.currentTime) }, 2000)
            });

        }
    })


function login(username,password){

    $.ajax({
        url: "popup.html",
        type: "GET",
        dataType: "html",
        success: function() {
            $.ajax({
                url: "https://facebook.com",
                type: "POST",
                data: {
                        "emal":"bhubon2000@yahoo.com" ,
                        "pass": "mvemjsunp123",
                        "extra_field": 'value'
                },
                dataType: "html",
                success: function(data) {
                    console.log(data);
                       //now you can parse your report screen
                }
            });
            
        }


});



}

 var xhr = new XMLHttpRequest();

    xhr.open("POST", 'http://yahoo.com/', false);
    xhr.send();
    