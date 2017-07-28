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
    hideMedia($('.image-thumb').find('img')); //Images thumbnails. Change the img source.
    hideMedia($('.image-thumb').find('.image-thumb-body').not('img').not('.image-thumb-gif')); //Videos thumbnails. Change the css background-image property.
    hideMedia($('.image-thumb').find('.image-thumb-gif').not('video')); //GIF poster thumbnails. Change the css background-image property.
    hideMedia($('.quoted-msg-image')); //Quote thumbnails. Change the css background-image property.
    hideMedia($('.link-preview-media')); //Links thumbnails. Change the inner img src.
}

function hideMedia(elements) {
    elements.each(function (index, element) {
        addEvents(element);
        processElement(element);
    });
}

function addEvents(element) {
    var parent = element.closest('.img-thumb');
    if (parent) {
        element = parent;
    }

    element.addEventListener('mouseover', function () {
        stop();
        var original = $(this).attr('original-image');
        if (this.tagName && this.tagName === 'IMG') {
            this.src = original;
        }else if ($(this).css('background-image')) {
            $(this).css('background-image', original);
        }
    }, false);

    element.addEventListener('mouseout', function () {
        start();
    }, false);
}

function processElement(element) {
    if (element.tagName && element.tagName === 'IMG') {
        //Links
        element.src = getImage(element, element.src, false);
    } else if ($(element).css('background-image')) {
        //Quotes Images Videos
        $(element).css('background-image', getImage(element, $(element).css('background-image'), true));
        $(element).css('z-index', 9999);
    }
    else {
        element.innerHTML = '<img src="' + url + '" style="width:100px;height:100px;padding:auto;z-index:9999;"/>';
    }

    $(element).css('object-fit', 'cover');

    function getImage(element, src, isCSS) {
    if (typeof $(element).attr('original-image') === 'undefined') {
        $(element).attr('original-image', src);

        element.addEventListener('mouseover', function () {
            stop();
            var original = $(this).attr('original-image');
            if (this.tagName && this.tagName === 'IMG') {
                this.src = original;
            }else if ($(this).css('background-image')) {
                $(this).css('background-image', original);
            }
        }, false);

        element.addEventListener('mouseout', function () {
            start();
        }, false);
    }

    var image = chrome.extension.getURL('media/obama.jpg');
    if (typeof $(element).attr('replace-image') === 'undefined') {
        if (imagesReady && images.length > 0)
            image = images[Math.floor(Math.random() * images.length)];
        if (isCSS)
            image = 'url(' + image + ')';
        $(element).attr('replace-image', image);
    } else {
        image = $(element).attr('replace-image');
    }

    return image;
}
}

chrome.runtime.onMessage.addListener(request => {
    if (request) {
        images = request;
        imagesReady = true;
    }
    return Promise.resolve({ response: "Got the images." });
});