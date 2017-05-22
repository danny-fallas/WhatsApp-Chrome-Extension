'use strict';

var run;
var status = false
var observer = new MutationObserver(selectMedia);
var images = {};
var imagesReady = false;

function start() {
    if (status === 'false') {
        observer.observe(document, { childList: true, subtree: true, });
        status = true;
        return { service: 'Running' };
    }
}

function stop() {
    if (status === 'true') {
        observer.disconnect();
        status = false;
        return { service: 'Stopped' };
    }
}

function selectMedia() {
    console.log('working');
    hideMedia($('.image-thumb-body')); //Images and videos thumbnails. Change the css background-image property or img source.
    hideMedia($('.quoted-msg-image')); //Quote thumbnails. Change the css background-image property.
    hideMedia($('.link-preview-media')); //Links thumbnails. Change the inner img src.
    hideMedia($('.image-thumb').find('video')); //GIF poster thumbnails. Change the poster property.
}

function hideMedia(elements) {
    elements.each(function (index, element) {
        processElement(element);
    });
}

function processElement(element) {
    if (element.tagName && element.tagName === 'IMG') {
        //Links
        element.src = getImage(element, element.src, false);
    } else if (element.tagName && element.tagName === 'VIDEO') {
        //GIF
        $(element).attr('poster', getImage(element, element.src, false));
    } else if ($(element).css('background-image')) {
        //Quotes Images Videos
        $(element).css('background-image', getImage(element, $(element).css('background-image'), true));
        $(element).css('z-index', 9999);
    }
    else {
        element.innerHTML = '<img src="' + url + '" style="width:100px;height:100px;padding:auto;z-index:9999;"/>';
    }
}


function getImage(element, src, isCSS) {
    if (typeof $(element).attr('original-image') === 'undefined') {
        $(element).attr('original-image', src);

        element.addEventListener('mouseover', function () {
            stop();
            var original = $(this).attr('original-image');
            if (this.tagName && (this.tagName === 'IMG' || this.tagName === 'VIDEO')) {
                this.src = original;
            } else if ($(this).css('background-image')) {
                $(this).css('background-image', original);
            }
        }, false);

        element.addEventListener('mouseout', function () {
            start();
        }, false);
    }

    var image = chrome.extension.getURL('media/obama.jpg');
    if (imagesReady && !images.includes(src)) {
        image = images[Math.floor(Math.random() * images.length)];
    }else if(images.includes(src)){
        image = src;
    }

    if (isCSS)
        return 'url(' + image + ')';
    else
        return image;
}

chrome.runtime.onMessage.addListener(request => {
    if (request) {
        images = request;
        imagesReady = true;
    }
    return Promise.resolve({ response: "Got the images." });
});