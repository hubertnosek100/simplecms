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
                    app.simplecontainer.init();
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

    function _readStyles(el) {
        var styles = {};
        var i = 0;
        while (el.style[i]) {
            styles[el.style[i]] = el.style[el.style[i]]
            i++;
        }
        return styles;
    }

    function _clearStyles(obj) {
        var s = obj.style;
        while (s[0]) {
            s[s[0]] = ""
        }
    }

    function _unwrap(data) {
        if (data instanceof Array) {
            if (data.length > 0) {
                return data[0];
            }
        } else {
            return data;
        }
    }

    return {
        listenForCombination: _listenForCombination,
        readStyles: _readStyles,
        clearStyles: _clearStyles,
        unwrap: _unwrap
    }
}())