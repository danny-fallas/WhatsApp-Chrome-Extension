var isActive = false;
var activeOnce = false;
var _tabId = null;

function startService() {
    chrome.browserAction.setIcon({ path: 'media/on.png' });
    chrome.browserAction.setTitle({ title: 'Turn OFF' });
    runScript({ code: 'start()' });
    activeOnce = true;
}

function stopService() {
    chrome.browserAction.setIcon({ path: 'media/off.png' });
    chrome.browserAction.setTitle({ title: 'Turn ON' });
    runScript({ code: 'stop()' });
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
    //If the service was used once it will keep it on
    if (activeOnce && (changeInfo.title && changeInfo.title.toLowerCase().includes('whatsapp'))
        || (changeInfo.url && changeInfo.url.toLowerCase().includes('whatsapp'))) {
        isActive = true;
        startService();
    }
});

function runScript(code) {
    function callback(response) {
        console.debug(response);
    }

    try {
        if (code.code)
            chrome.tabs.executeScript(_tabId, code, callback);
        else if (code.file)
            chrome.tabs.executeScript(_tabId, code);
    } catch (e) {
        console.error('ERROR@chrome.tabs.executeScript: ' + e);
    }
}

runScript({ file: 'contentscript.js' });