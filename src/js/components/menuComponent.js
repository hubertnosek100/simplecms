app.menuComponent = function (target) {

    var _clearStyles = function (s) {
        while (s[0]) {
            s[s[0]] = ""
        }
    }

    var _draw = function (el, uuid) {
        try {
            var css = JSON.parse($(el).val())
            var obj = $('simpletext[uuid="' + uuid + '"]');
            _clearStyles(obj[0].style)
            for (var style in css) {
                if (css.hasOwnProperty(style)) {
                    obj.css(style, css[style]);
                }
            }
            app.simpletext.save({ target: obj[0] })
            $('#componenJsonHelp').text("")
        } catch (err) {
            $('#componenJsonHelp').text("Not valid Json")
        }
    }

    var found = function (data) {
        if (data.length > 0) {
            var el = data[0];
            app.menu.current = el;
            $('#componentUuid').val(el.uuid)
            $('#componentJsonCss').val(JSON.stringify(el.css));

            var draw = app.debounce(_draw, 1000);
            $('#componentJsonCss').unbind();
            $('#componentJsonCss').on('keyup', function (evt) {
                draw(evt.target, el.uuid);
            });
        }
    };
    var id = $(target).attr('db-id');
    app.simpletext.find(app.url, id, found);
};