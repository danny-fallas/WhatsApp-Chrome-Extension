var isActive = false;
var _tabId = '';

function startService() {
    chrome.browserAction.setIcon({ path: '128.png' });
    chrome.browserAction.setTitle({ title: 'Turn OFF' });
    chrome.tabs.executeScript(_tabId, { code: 'start()' }, executeScriptCallback);
}

function stopService() {
    chrome.browserAction.setIcon({ path: '32.png' });
    chrome.browserAction.setTitle({ title: 'Turn ON' });
    chrome.tabs.executeScript(_tabId, { code: 'stop()' }, executeScriptCallback);
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
    //TO DO: fix this functionality, the onUpdate method executes everytime any tab updates
    if ((changeInfo.title && changeInfo.title.toLowerCase().includes('whatsapp'))
        || (changeInfo.url && changeInfo.url.toLowerCase().includes('whatsapp'))) {
        isActive = false;
        stopService();
    }
});

function executeScriptCallback(response) {
    console.debug(response);
}