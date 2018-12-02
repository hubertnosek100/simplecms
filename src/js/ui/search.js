app.ui = app.ui ? app.ui : {};
app.ui.search = (function () {
    var obj = {};
    obj.text = undefined;

    obj.assign = function (selector) {
        var _search = app.debounce(obj.search, 1000);
        $(selector).on('keyup', function (e) {
            _search(e);
        });
    }

    obj.search = function (e) {
        obj.text = e.target.value;
        obj.callback();
    };

    obj.onChanged = function (callback) {
        this.callback = callback;
    };

    obj.getQuery = function () {
        if (obj.text)
            return "&q=" + obj.text;
        return "";
    }

    return obj;
}());