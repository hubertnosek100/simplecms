app.menu = (function () {
    var _current = undefined
    function _load(url) {
        app.service.get(url + "/simplecms/components/menu.html", _set, "html");
    }

    function _set(data) {
        $('body').append(data);
        $('#loginForm').on('submit', function (e) {
            e.preventDefault()
            var model = app.formToJSON($(e.target))
            app.service.login(model, _drawAuth)
        })
        $('#faviconId').attr('src', app.url + '/favicon.png')
    }

    function _init() {
        $('simpletext').contextmenu(function (e) {
            app.menuComponent(e.target)
            _openNav();
            e.preventDefault();
        });
        $(document).on('keydown', function (e) {
            if (e.keyCode === 27) {
                _closeNav();
            }
        });
    }

    function _openNav() {
        document.getElementById("mySidenav").style.width = "300px";
        $('body').append('<div id="backdrop" class="modal-backdrop fade show"></div>');
    }

    function _closeNav() {
        document.getElementById("mySidenav").style.width = "0";
        $('#backdrop').remove();
    }

    function _loginTab(params) {
        app.service.isAuthenticated(_drawAuth);
    }

    function _drawAuth(auth) {
        if (auth) {
            $('#loginForm').hide()
            $('#loginInfo').show()
        } else {
            $('#loginInfo').hide()
            $('#loginForm').show()
        }
    }

    $(document).ready(function () {
        _init();
    });

    return {
        load: _load,
        open: _openNav,
        close: _closeNav,
        current: _current,
        loginTab: _loginTab
    }
}())