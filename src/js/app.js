app = (function () {
    var _url;

    function _init(options) {
        app.url = options.url;
        app.service.set(options.apikey, options.defaultLang)
        $(document).ready(function () {
            app.simpletext.load(options.url);
            app.simpleimage.load(options.url);
            app.simplevideo.load(options.url);
            app.simplelanguage.load(options.url);
            app.simplecontainer.load(options.url);
            app.modal.load(options.url);
            app.menu.load(options.url);
            app.simpleeditor.listenForCombination();
        });
    }

    function _debounce(func, wait, immediate) {
        var timeout;
        return function () {
            var context = this,
                args = arguments;
            var later = function () {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    };

    function _formToJSON($form) {
        var unindexed_array = $form.serializeArray();
        var indexed_array = {};
        $.map(unindexed_array, function (item, index) {
            indexed_array[item['name']] = item['value'];
        });
        return indexed_array;
    }

    function _goTo(url) {
        window.location.href = url;
    }

    return {
        init: _init,
        url: _url,
        debounce: _debounce,
        formToJSON: _formToJSON,
        goTo: _goTo
    }
}());

var simplecms = app;