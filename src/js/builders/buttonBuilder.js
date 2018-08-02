var buttonBuilder = (function () {

    function _build(text, link) {
        return '<a href="' + link + '" class="btn btn-primary scms-primary scms-btn">' + text + '</a>';
    }

    return {
        build: _build,
    }
}());