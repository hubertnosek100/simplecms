app.menu = (function () {

    function _load(url) {
        app.service.get(url + "/simplecms/components/menu.html", _set, "html");
    }

    function _set(data) {
        $('body').append(data);
    }

    function _init() {
        $('simpletext').contextmenu(function (e) {
            _openNav();
            e.preventDefault();
        });
        $(document).on('keydown',function(e){
            if(e.keyCode === 27){
                _closeNav();
            }
        });
    }

    function _openNav() {
        document.getElementById("mySidenav").style.width = "250px";
        // document.body.style.backgroundColor = "rgba(0,0,0,0.4)";
        $('body').append('<div id="backdrop" class="modal-backdrop fade show"></div>');
    }

    function _closeNav() {
        document.getElementById("mySidenav").style.width = "0";
        // document.body.style.backgroundColor = "white";
        $('#backdrop').remove();
    }

    $(document).ready(function () {
        _init();
    });

    return {
        load: _load,
        open: _openNav,
        close: _closeNav
    }
}())