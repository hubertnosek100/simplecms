app.dashboard = (function () {

    function _init() {
        $(document).ready(function () {
            _load();

            $('#apikeygeneratebtn').on('click', _generate);
        });
    }

    function _load() {
        app.service.get("/apikey", _set);
    }

    function _set(auth) {
        if (auth.apikey !== "default") {
            $('#apikeytext').val(auth.apikey)
        }
    }

    function _generate(params) {
        var api = _guid();
       $('#apikeytext').val(api);
        app.service.post('/apikey/', {
            apikey: api
        });
    }

    function _guid() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        var s = '';
        for (let i = 0; i < 10; i++) {
            s += s4();
        }
        return s;
    }



    return {
        init: _init
    }
}());