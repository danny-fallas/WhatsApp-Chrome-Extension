(function () {
    var run;
    function start() {
        run = setInterval(hide_bubbles, 100);
        console.log("...Started");
    }

    function stop() {
        clearInterval(run);
        console.log("...Stopped");
    }

    function hide_bubbles() {
        var elements = document.getElementsByClassName('bubble-image');
        var quotes = document.getElementsByClassName('quoted-msg');
        var url = chrome.extension.getURL('/troll.png');
        var innerImg = '<img src="' + url + '" style="width:50px;height:50px;padding:auto;z-index:9999;"/>'
        var original = [];
        for (let i = 0; i < elements.length; i++) {
            //var element = elements[i].getElementsByTagName('img')[0];
            //if (element.src != url) {
            //    original[i] = element.src;
            //}

            //element.src = url;
            elements[i].innerHTML = innerImg;

            /*element.addEventListener("mouseover", function () {
                document.getElementsByClassName('pane-list-user')[0].getElementsByTagName('img')[0].src = original[i];
            }, false);
    
            element.addEventListener("mouseout", function () {
                document.getElementsByClassName('pane-list-user')[0].getElementsByTagName('img')[0].src = url;
            }, false);*/
            //elements[i].style.display = 'none';
        }

        for (var i = 0; i < quotes.length; i++) {
            //var quote = quotes[i].getElementsByTagName('img')[0];
            //quote.src = url;
            quotes[i].innerHTML = innerImg;
            //elements[i].style.display = 'none';
        }
    }
})();