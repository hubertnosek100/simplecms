app.menuComponent = function (target) {
    let tagName = target.tagName.toLocaleLowerCase();

    var _draw = function (el, uuid) {
        try {
            var css = JSON.parse($(el).val())
            var obj = $(tagName + '[uuid="' + uuid + '"]');
            app.simpleeditor.clearStyles(obj[0])
            for (var style in css) {
                if (css.hasOwnProperty(style)) {
                    obj.css(style, css[style]);
                }
            }
            app[tagName].save({
                target: obj[0]
            })
            $('#componenJsonHelp').text("")
        } catch (err) {
            $('#componenJsonHelp').text("Not valid Json")
        }
    }

    var found = function (data) {
        var el = app.simpleeditor.unwrap(data)
        if (el) {
            app.menu.current = el;
            $('#componentUuid').val(el.uuid)
            $('#componentJsonCss').val(JSON.stringify(el.css, undefined, 4));

            var draw = app.debounce(_draw, 1000);
            $('#componentJsonCss').unbind();
            $('#componentJsonCss').on('keyup', function (evt) {
                draw(evt.target, el.uuid);
            });
        }
    };
    var uuid = $(target).attr('uuid');
    app[tagName].find(app.url, uuid, found);
};