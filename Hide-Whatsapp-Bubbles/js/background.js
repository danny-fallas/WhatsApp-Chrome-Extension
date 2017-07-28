'use strict';

var isActive = false;
var activeOnce = false;
var _tabId = null;
var images = [];
var imagesReady = false;

/* CHROME API */
chrome.browserAction.onClicked.addListener(function (tab) {
    changeStatus(tab.Id || tab.id);
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (!imagesReady)
        getImages();

    if (activeOnce && (tab.url && tab.url.toLowerCase().includes('whatsapp')) && (tab.status && tab.status === 'complete')) {
        isActive = true;
        startService();
    }
});

chrome.contextMenus.create({
    title: "Donate 1$",
    contexts: ["browser_action"],  // ContextType
    onclick: rightClickHandler // A callback function
});
/* END CHROME API */

function startService() {
    chrome.browserAction.setIcon({ path: 'media/on.png' });
    chrome.browserAction.setTitle({ title: 'Turn OFF' });
    runScript({ code: 'start()' });
    activeOnce = true;

    if (imagesReady)
        sendMessageToTabs(images);
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

function rightClickHandler() {
    if (confirm('Donate 1$ with PayPal?'))
        var win = window.open('https://www.paypal.me/DannyFallas/1', '_blank');
};

function sendMessageToTabs(message) {
    chrome.tabs.sendMessage(_tabId, message, null, null)
        .then(response => console.log(response))
        .catch(onError);
}

function runScript(code) {
    function callback(response) {
        var r = response;
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


function getImages() {
    const feedURL = 'https://api.unsplash.com/photos?client_id=08aac6aa1c68e14f6e52c4650cd365fa8232f83669850353eba852a566ff3806&per_page=100';
    fetch(feedURL)
        .then(response => response.json())
        .then((items) => {
            items.forEach(item => images.push(item.urls.small));
            imagesReady = true;
        });
}

//Load content script
runScript({ file: 'contentscript.js' });
//Force stop the service on start
stopService();