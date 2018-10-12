app = (function () {
    var _url;

    function _init(url, apikey) {
        app.url = url;
        app.service.set(apikey)

        $(document).ready(function () {
            app.simpletext.load(url);
            app.simpleimage.load(url);
            app.simplevideo.load(url);
            app.modal.load(url);
            app.menu.load(url);
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

    return {
        init: _init,
        url: _url,
        debounce: _debounce,
        formToJSON: _formToJSON
    }
}());

var simplecms = app;