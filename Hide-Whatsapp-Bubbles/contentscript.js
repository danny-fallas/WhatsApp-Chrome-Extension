var run;
function start() {
    run = setInterval(hide_bubbles, 100);
    console.log('...Started');
    return { service: 'Running' };
}

function stop() {
    clearInterval(run);
    console.log('...Stopped');
    return { service: 'Stopped' };
}

function hide_bubbles() {
    var elements = joinElements(document.getElementsByClassName('bubble-image'), document.getElementsByClassName('quoted-msg'));
    var url = chrome.extension.getURL('/troll.png');
    var innerImg = '<img src="' + url + '" style="width:50px;height:50px;padding:auto;z-index:9999;"/>'
    var original = [];

    for (let i = 0; i < elements.length; i++) {
        var element = elements[i];//.getElementsByTagName('img')[0];
        //if (element.src != url) {
        //    original[i] = element.src;
        //}

        var imgElement = element.getElementsByTagName('IMG')[0]; //First image in the bubble

        if (imgElement && imgElement.tagName && imgElement.tagName === 'IMG')
            imgElement.src = url;
        else
            element.innerHTML = innerImg;

        /*element.addEventListener('mouseover', function () {
            document.getElementsByClassName('pane-list-user')[0].getElementsByTagName('img')[0].src = original[i];
        }, false);
 
        element.addEventListener('mouseout', function () {
            document.getElementsByClassName('pane-list-user')[0].getElementsByTagName('img')[0].src = url;
        }, false);*/
        //elements[i].style.display = 'none';
    }
}

function joinElements(elementGroup1, elementGroup2) {
    // convert both to arrays so they have the full complement of Array methods
    var array1 = Array.prototype.slice.call(elementGroup1, 0);
    var array2 = Array.prototype.slice.call(elementGroup2, 0);

    return array1.concat(array2);
}