var run;
function start() {
    run = setInterval(hideBubbles, 100);
    console.log('...Started');
    return { service: 'Running' };
}

function stop() {
    clearInterval(run);
    console.log('...Stopped');
    return { service: 'Stopped' };
}

function hideBubbles() {
    var url = chrome.extension.getURL('media/troll.png');
    var cssUrl = 'url(' + url + ')';
    var innerImg = '<img src="' + url + '" style="width:50px;height:50px;padding:auto;z-index:9999;"/>'

    hideMedia($('.image-thumb-body')); //Images and videos thumbnails. Change the css background-image property or img source.
    hideMedia($('.quoted-msg-image')); //Quote thumbnails. Change the css background-image property.
    hideMedia($('.link-preview-media')); //Links thumbnails. Change the inner img src.

    function hideMedia(elements) {
        elements.each(function (index, element) {
            if ($(element).attr('hiddem-image') === 'true') return 'non-false';
            //if (element.src != url) {
            //    original[i] = element.src;
            //}

            //var imgElement = element.children('IMG')[0]; //if the elemet has an IMG inside this captures it.
            if (element.tagName && element.tagName === 'IMG') {
                if (typeof $(element).attr('original-image') === 'undefined')
                    $(element).attr('original-image', element.src);

                element.src = url;
            } else if ($(element).css('background-image')) {
                if (typeof $(element).attr('original-image') === 'undefined')
                    $(element).attr('original-image', $(element).css('background-image'));

                $(element).css('background-image', cssUrl);
            } else {
                element.innerHTML = innerImg;
            }


            element.addEventListener('mouseover', function () {
                stop();
                var original = $(element).attr('original-image');

                if (this.tagName && this.tagName === 'IMG') {
                    this.src = original;
                } else if ($(this).css('background-image')) {
                    $(this).css('background-image', original);
                }
            }, false);

            element.addEventListener('mouseout', function () {
                start();
                if (this.tagName && this.tagName === 'IMG') {
                    this.src = url;
                } else if ($(this).css('background-image')) {
                    $(this).css('background-image', cssUrl);
                }
            }, false);
            //elements[i].style.display = 'none';

            $(element).attr('hiddem-image', 'true');
        });
    }
}

function joinElements(elementGroup1, elementGroup2) {
    // convert both to arrays so they have the full complement of Array methods
    var array1 = Array.prototype.slice.call(elementGroup1, 0);
    var array2 = Array.prototype.slice.call(elementGroup2, 0);

    return array1.concat(array2);
}

window.onload = function () {
    if (window.jQuery)
        console.log('...jQuery is up and running.')
    else
        console.error("ERROR: Couldn't load jQuery");
}