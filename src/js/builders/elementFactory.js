var elementFactory = (function () {

    var _builders = [];

    function _register(key, builder) {
        _builders[key] = builder;
    }

    function _build(type, name, items) {
        var builder = _builders[type];
        if (builder) {
            return builder.build(name, items);
        }
    }

    return {
        build: _build,
        register: _register
    }
}());


