var colorBuilder = (function () {

    function _init() {
        elementFactory.register("color", colorBuilder);
    }

    function _build(name) {
        var dispName = name;
        var formgroup = uiBuilder.buildFormGroup(name);
        name = name.replace(/\s/g, '');
        var colorpicker = '<input id="colorpicker' + name + '" name="' + name + '" type="text" class="form-control" value="rgb(255, 128, 0)" />'
        formgroup.append(colorpicker);
        return {
            content: formgroup,
            callback: function () {
                $('#colorpicker' + name).colorpicker();
            }
        };
    }

    $(document).ready(_init);
    return {
        build: _build,
    }
}());