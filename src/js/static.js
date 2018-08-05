app.static = (function () {

    var _simpleimage = "simpleimage";
    var _simpletext = "simpletext";
    var _simplevideo = "simplevideo";
    var _modal = "simplemodal";
    var _exponent = "exponent";
    var _template = "template";

    var _components = [_simpletext, _simpleimage, _simplevideo, _exponent, _template];
    var _elementTypes = ["text", "number", "date", "datetime", "color", "link", "collection"];

    return {
        simpleimage: _simpleimage,
        simpletext: _simpletext,
        simplevideo: _simplevideo,
        modal: _modal,
        components: _components,
        exponent: _exponent,
        template: _template,
        elementTypes: _elementTypes
    }
}());