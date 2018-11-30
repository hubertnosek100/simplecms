app.static = (function () {

    var _simpleimage = "simpleimage";
    var _simpletext = "simpletext";
    var _simplevideo = "simplevideo";
    var _simplecontainer = "simplecontainer";
    var _modal = "simplemodal";
    var _exponent = "exponent";
    var _template = "template";
    var _simplelanguage = "simplelanguage";

    var _components = [_simpletext, _simpleimage, _simplevideo, _exponent, _template, _simplecontainer];
    var _elementTypes = ["text", "number", "date", "datetime", "color", "link", "collection"];

    return {
        simpleimage: _simpleimage,
        simpletext: _simpletext,
        simplevideo: _simplevideo,
        simplecontainer: _simplecontainer,
        modal: _modal,
        components: _components,
        exponent: _exponent,
        template: _template,
        elementTypes: _elementTypes,
        simplelanguage: _simplelanguage
    }
}());