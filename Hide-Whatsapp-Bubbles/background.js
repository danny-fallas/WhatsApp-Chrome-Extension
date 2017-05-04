var toggle = false;

function startService(tab) {
    chrome.browserAction.setIcon({ path: "128.png" });
    chrome.browserAction.setTitle({ title: "Turn OFF" });
    chrome.tabs.executeScript(tab.id, { code: "start()" }, callback);
}

function stopService(tab) {
    chrome.browserAction.setIcon({ path: "32.png" });
    chrome.browserAction.setTitle({ title: "Turn ON" });
    chrome.tabs.executeScript(tab.id, { code: "stop()" }, callback);
}

chrome.browserAction.onClicked.addListener(function (tab) {
    toggle = !toggle;
    if (toggle) {
        startService(tab);
    }
    else {
        stopService(tab);
    }
});

//TO DO: Add a onTabReload event function to restart the service.

function callback(results) {
    console.log(results);
}