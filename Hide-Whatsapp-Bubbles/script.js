var toggle = true;

chrome.browserAction.onClicked.addListener(function (tab) { 
    toggle = !toggle;
    if (toggle) {
        chrome.browserAction.setIcon({
            path: "128.png"
        });
        chrome.tabs.executeScript({
            code: "start()"
        });

    }
    else {
        chrome.browserAction.setIcon({
            path: "32.png"
        });
        chrome.tabs.executeScript({
            code: "stop()"
        });
    }
});