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
    activeOnce = false;
}

function changeStatus(tabId) {
    _tabId = tabId;
    isActive = !isActive;

    if (isActive) {
        startService();
    }
    else {
        stopService();
        chrome.tabs.reload(_tabId);
    }
}

chrome.browserAction.onClicked.addListener(function (tab) {
    changeStatus(tab.Id);
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (activeOnce && (tab.url && tab.url.toLowerCase().includes('whatsapp')) && (tab.status && tab.status === 'complete')) {
        isActive = true;
        startService();
    }
});

function runScript(code) {
    function callback(response) {
        //console.debug(response);
    }

    try {
        if (code.code)
            chrome.tabs.executeScript(_tabId, code, callback);
        else if (code.file)
            chrome.tabs.executeScript(_tabId, code);
    } catch (e) {
        //console.error('ERROR@chrome.tabs.executeScript: ' + e);
    }
}

runScript({ file: 'contentscript.js' });