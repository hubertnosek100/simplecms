app.simpleeditor = (function () {

    function _listenForCombination(params) {
        var keys = {
            shift: false,
            ctrl: false,
            e: false
        };
        var done = false;
        $(document.body).keydown(function (e) {
            // console.log(e.key)
            // console.log(e.keyCode)
            if (e.keyCode == 16) {
                keys["shift"] = true;
            } else if (e.keyCode == 17) {
                keys["ctrl"] = true;
            } else if (e.keyCode == 69) {
                keys["e"] = true;
            }
            if (keys["shift"] && keys["ctrl"] && keys["e"]) {
                if (!done) {
                    done = true
                    app.simplevideo.init();
                    app.simpleimage.init();
                    app.simpletext.init();
                    app.menu.init();
                }
            }
        });

        $(document.body).keyup(function (e) {
            // reset status of the button 'released' == 'false'
            if (e.keyCode == 16) {
                keys["shift"] = false;
            } else if (e.keyCode == 17) {
                keys["ctrl"] = false;
            } else if (e.keyCode == 69) {
                keys["e"] = false;
            }
        });
    }
    return {
        listenForCombination: _listenForCombination
    }
}())