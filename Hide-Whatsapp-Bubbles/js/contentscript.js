var run;
var status = false;
function start() {
    if (status === 'false') {
        run = setInterval(hideBubbles, 100);
        //console.log('...Started');
        status = true;
        return { service: 'Running' };
    }
}

function stop() {
    if (status === 'true') {
        clearInterval(run);
        //console.log('...Stopped');
        status = false;
        return { service: 'Stopped' };
    }
}

function hideBubbles() {
    var url = chrome.extension.getURL('media/obama.jpg');
    var cssUrl = 'url(' + url + ')';
    var innerImg = '<img src="' + url + '" style="width:50px;height:50px;padding:auto;z-index:9999;"/>'

    hideMedia($('.image-thumb-body')); //Images and videos thumbnails. Change the css background-image property or img source.
    hideMedia($('.quoted-msg-image')); //Quote thumbnails. Change the css background-image property.
    hideMedia($('.link-preview-media')); //Links thumbnails. Change the inner img src.
    hideMedia($('.image-thumb').find('video')); //GIF poster thumbnails. Change the poster property.

    function hideMedia(elements) {
        elements.each(function (index, element) {
            if (element.tagName && element.tagName === 'IMG') {
                //Links
                setOriginalImageAttr(element, element.src);
                element.src = url;
            } else if (element.tagName && element.tagName === 'VIDEO') {
                //GIF
                setOriginalImageAttr(element, element.src);
                $(element).attr('poster', url);
            } else if ($(element).css('background-image')) {
                //Quotes Images Videos
                setOriginalImageAttr(element, $(element).css('background-image'));
                $(element).css('background-image', cssUrl);
                $(element).css('z-index', 9999);
            }
            else {
                element.innerHTML = innerImg;
            }

            function setOriginalImageAttr(element, src) {
                if (typeof $(element).attr('original-image') === 'undefined') {
                    $(element).attr('original-image', src);
                    element.addEventListener('mouseover', function () {
                        stop();
                        var original = $(this).attr('original-image');
                        if (this.tagName && this.tagName === 'IMG') {
                            this.src = original;
                        } else if (this.tagName && this.tagName === 'VIDEO') {
                            this.src = original;
                        } else if ($(this).css('background-image')) {
                            $(this).css('background-image', original);
                        }
                    }, false);

                    element.addEventListener('mouseout', function () {
                        start();
                        if (this.tagName && this.tagName === 'IMG') {
                            this.src = url;
                        } else if (this.tagName && this.tagName === 'VIDEO') {
                            this.src = url;
                        } else if ($(this).css('background-image')) {
                            $(this).css('background-image', cssUrl);
                        }
                    }, false);
                }
            }
        });
    }
}

function joinElements(elementGroup1, elementGroup2) {
    // convert both to arrays so they have the full complement of Array methods
    var array1 = Array.prototype.slice.call(elementGroup1, 0);
    var array2 = Array.prototype.slice.call(elementGroup2, 0);

    return array1.concat(array2);
}