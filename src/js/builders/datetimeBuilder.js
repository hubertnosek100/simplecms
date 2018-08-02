var datetimeBuilder = (function () {

    function _init() {
        elementFactory.register("datetime", datetimeBuilder);
    }

    function _build(name) {
        var dispName = name;
        name = name.replace(/\s/g,'');
        var datepicker = '<div class="form-group w-25 p-2"><label>'+ dispName+ '</label><div class="input-group date" id="datetimepicker'+name+'" data-target-input="nearest"><input name="'+name+'" type="text" class="form-control datetimepicker-input" data-target="#datetimepicker'+name+'"><div class="input-group-append" data-target="#datetimepicker'+name+'" data-toggle="datetimepicker"><div class="input-group-text"><i class="fa fa-calendar"></i></div></div></div></div>'
        return {
            content: datepicker,
            callback: function () {
                $('#datetimepicker' + name).datetimepicker();
            }
        };
    }

    $(document).ready(_init);
    return {
        build: _build,
    }
}());