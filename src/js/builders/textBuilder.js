var textBuilder = (function () {

    function _init() {
        elementFactory.register("text", textBuilder);
    }

    function _build(name) { 
        var formgroup = uiBuilder.buildFormGroup(name);
        formgroup.append('<input class="form-control " required name="' + name + '" type="text"></input>');
        return formgroup;
    }

    $(document).ready(_init);
    return {
        build: _build,
    }
}());