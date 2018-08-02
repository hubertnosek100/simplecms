app.service = (function () {

    var _key = 'default';

    function _get(url, callback, dataType) {

        if (!dataType) {
            dataType = "json"
        }
        $.ajax({
            dataType: dataType,
            url: url,
            success: callback,
            headers: {
                "Apikey": _key
            }
        });
    }

    function _request(url, model, method) {
        $.ajax({
            type: method,
            contentType: "application/json; charset=utf-8",
            url: url,
            data: JSON.stringify(model),
            headers: {
                "Apikey": _key
            },
            success: function (data) {
                console.log("success")
            },
            error: function (data) {
                console.log("failure")
            },
            dataType: "html"
        });
    }

    function _post(url, model) {
        _request(url, model, "POST")
    }

    function _put(url, model) {
        _request(url, model, "PUT")
    }

    function _delete(url, model) {
        _request(url, model, "DELETE")
    }

    function _set(apikey) {
        _key = apikey;
    }

    return {
        post: _post,
        put: _put,
        get: _get,
        delete: _delete,
        set: _set
    }
}());