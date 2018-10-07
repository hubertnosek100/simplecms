app.service = (function () {

    var _key = 'default';

    function _get(url, callback, dataType, model) {
        if (!dataType) {
            dataType = "json"
        }
        $.ajax({
            dataType: dataType,
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(model),
            url: url,
            success: callback,
            headers: {
                "Apikey": _key
            }
        });
    }

    function _request(url, model, method, callback, dataType) {
        if (!dataType) {
            dataType = "html"
        }
        $.ajax({
            type: method,
            contentType: "application/json; charset=utf-8",
            url: url,
            data: JSON.stringify(model),
            headers: {
                "Apikey": _key,
                "token": _getCookie('simplecms_token')
            },
            success: function (data) {
                console.log("success")
                if (callback) callback(data);
            },
            error: function (data) {
                console.log("failure")
                if (callback) callback(data);
            },
            dataType: dataType
        });
    }

    function _post(url, model, callback, dataType) {
        _request(url, model, "POST", callback, dataType)
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

    function _getCookie(cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }

    function _setCookie(cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        var expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }

    function _isAuthenticated(callback) {
        _post(app.url + '/api/check', {}, function (data) {
            console.log(JSON.stringify(data))
            callback(data.succes)
        }, 'json')
    }

    function _login(model, onSuccess) {
        _post(app.url + '/api/login', model, function (data) {
            if (data.token) {
                _setCookie("simplecms_token", data.token, 1)
                onSuccess(true)
            }
        }, 'json')
    }

    return {
        post: _post,
        put: _put,
        get: _get,
        delete: _delete,
        set: _set,
        isAuthenticated: _isAuthenticated,
        login: _login
    }
}());