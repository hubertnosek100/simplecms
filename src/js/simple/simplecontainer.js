app.simplecontainer = (function () {

    function _load(url) {
        var containers = $(app.static.simplecontainer)
        for (let i = 0; i < containers.length; i++) {
            const $cont = $(containers[i]);
            _find(url, $cont.attr("uuid"), function (data) {
                var el = app.simpleeditor.unwrap(data)
                if (el) {
                    $cont.attr("db-id", el.id);
                    // todo function writeStyles!
                    var css = el.css
                    for (var style in css) {
                        if (css.hasOwnProperty(style)) {
                            $cont.css(style, css[style]);
                        }
                    }
                } else {
                    _save({
                        target: $cont[0]
                    })
                }
            });
        }
    }

    function _find(url, uuid, callback) {
        app.service.get(url + "/" + app.static.simplecontainer + '?uuid=' + uuid, callback);
    }

    function _save(el) {
        var uuid = $(el.target).attr('uuid');
        var id = $(el.target).attr('db-id');
        var css = app.simpleeditor.readStyles(el.target);
        if (id) {
            app.service.put(app.url + "/" + app.static.simplecontainer + "/" + id, {
                id: id,
                uuid: uuid,
                css: css
            })
        } else {
            app.service.post(app.url + "/" + app.static.simplecontainer, {
                uuid: uuid,
                css: css
            })
        }
    }


    function _makeEditable() {
        var editButton = $('<button type="button" class="btn btn-primary scms-primary scms-btn btn-sm">EDIT</button>')
        var editAble = $('<div class="container-editable"></div>')
        editButton.on('click', _edit)
        editAble.append(editButton)
        $(app.static.simplecontainer).prepend(editAble)
        $(app.static.simplecontainer).addClass('editable')
    }

    function _edit(e) {
        app.menu.open();
        app.menuComponent($(e.target).parent().parent()[0])
    }

    return {
        load: _load,
        save: _save,
        init: _makeEditable,
        find: _find
    }
}());