var numberBuilder = (function () {

    function _init() {
        elementFactory.register("number", numberBuilder);
    }

    function _build(name) {
        var formgroup = uiBuilder.buildFormGroup(name);
        formgroup.append('<input class="form-control w-25" required name="' + name + '" type="number"></input>');
        return formgroup;
    }

    $(document).ready(_init);
    return {
        build: _build,
    }
}());