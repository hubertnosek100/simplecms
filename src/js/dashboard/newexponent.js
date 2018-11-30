app.newexponent = (function () {
    function _init() {
        $(document).ready(function () {
            _load();
            $('#createexponentform').on("submit", _submit)
        });
    }

    function _submit(e) {
        e.preventDefault();
        var model = app.formToJSON($("#createexponentform"));

        $("#createexponentform").find('form').toArray().splice(0, 1)
        var forms = $("#createexponentform").find('form').toArray()
        var colForm = forms.splice(0, 1);
        var id = $(colForm).attr('id');
        model[id] = [];

        forms.forEach((el) => {
            model[id].push(app.formToJSON($(el)));
        });

        model.templateid = $("#newtemplateselect").val();
        model.template = $("#newtemplateselect option:selected").text();
        app.service.post("/" + app.static.exponent, model, _templateAdded)
    }

    function _templateAdded(data) {
        if(JSON.parse(data)){
            window.location.reload()
        }
    }

    function _load() {
        app.service.get("/" + app.static.template, _set);

        $("#newtemplateselect").on("change", _loadTemplate);
    }

    function _set(data) {
        if (data.length === 0) {
            var $list = $('.template-list');
            $p = $('<p class="p-3">You have no templates. </p>');
            var btn = buttonBuilder.build("Create new template", "/simplecms/dashboard/newtemplate");
            $p.append(btn);
            $list.append($p)
        } else {
            data.forEach(element => {
                $("#newtemplateselect").append('<option value="' + element.id + '" >' + element.name + '</option>')
            });
            _setTemplate(data[0]);
        }
    }

    function _loadTemplate(params) {
        var id = $("#newtemplateselect").val();
        app.service.get("/" + app.static.template + "/" + id, _setTemplate);
    }

    function _setTemplate(template) {
        _clear("newexponentcontent");
        if (template.elements.length > 0) {
            template.elements.forEach(element => {
                var uiEl = elementFactory.build(element.type, element.name, element.items);
                if (uiEl && uiEl.callback) {
                    $("#newexponentcontent").append(uiEl.content);
                    uiEl.callback();
                } else {
                    $("#newexponentcontent").append(uiEl);
                }
            });
        }
    }

    function _clear(id) {
        var myNode = document.getElementById(id);
        while (myNode.firstChild) {
            myNode.removeChild(myNode.firstChild);
        }
    }

    return {
        init: _init
    }
}());