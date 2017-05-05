var isActive = false;
var _tabId = "";

function startService() {
    chrome.browserAction.setIcon({ path: "128.png" });
    chrome.browserAction.setTitle({ title: "Turn OFF" });
    chrome.tabs.executeScript(_tabId, { code: "start()" });
}

function stopService() {
    chrome.browserAction.setIcon({ path: "32.png" });
    chrome.browserAction.setTitle({ title: "Turn ON" });
    chrome.tabs.executeScript(_tabId, { code: "stop()" });
}

function changeStatus(tabId) {
    _tabId = tabId;
    isActive = !isActive;

    if (isActive) {
        startService();
    }
    else {
        stopService();
    }
}

chrome.browserAction.onClicked.addListener(function (tab) {
    changeStatus(tab.Id);
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (changeInfo.status === "complete") {
        isActive = false;
        stopService();
    }
});