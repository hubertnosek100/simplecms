app.simpletext = (function () {

    function _find(url, id, callback) {
        app.service.get(url + "/" + app.static.simpletext + '?id=' + id, callback);
    }

    function _load(url) {
        app.service.get(url + "/" + app.static.simpletext, _set);
        _init();
    }

    function _init() {
        $simpletexts = $(app.static.simpletext);
        $simpletexts.each(function (idx, el) {
            $(el).attr('contenteditable', true);
            $(el).attr('data-placeholder', "Insert text here...");
            var save = app.debounce(_save, 1000);
            $(el).on('keyup', function (evt, el) {
                save(evt, el);
            });
        });
    }

    function _save(el) {
        var text = $(el.target).text();
        var uuid = $(el.target).attr('uuid');
        var id = $(el.target).attr('db-id');
        var css = _readStyles(el.target);
        if (id) {
            app.service.put(app.url + "/" + app.static.simpletext + "/" + id, {
                id: id,
                uuid: uuid,
                text: text,
                css: css
            })
        } else {
            app.service.post(app.url + "/" + app.static.simpletext, {
                uuid: uuid,
                text: text,
                css: css
            })
        }
    }

    function _readStyles(el) {
        var styles = {};
        var cur = el.style[0];
        var i = 0;
        while (el.style[i]) {
            styles[el.style[i]] = el.style[el.style[i]]
            i++;
        }
        return styles;
    }

    function _set(data) {
        data.forEach(function (el) {
            $simpletext = $(app.static.simpletext + "[uuid='" + el.uuid + "'");
            $simpletext.text(el.text);
            $simpletext.attr("db-id", el.id);
            var css = el.css
            for (var style in css) {
                if (css.hasOwnProperty(style)) {
                    $simpletext.css(style, css[style]);
                }
            }
        });
    }

    return {
        load: _load,
        find: _find,
        save: _save
    }
}());