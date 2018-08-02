app.newtemplate = (function () {


    var _list = [];

    function _init() {
        $('#addelementform').on("submit", _addNewElement);
        app.static.elementTypes.forEach(element => {
            $('#newtemplatetypeselect')
                .append('<option value="' + element + '">' + element + '</option>');
        });

        $("#addtemplateform").on("submit", _addTemplate);
    }

    function _addTemplate(e) {
        e.preventDefault();

        var model = app.formToJSON($("#addtemplateform"));
        model.elements = _list;
        app.service.post("/" + app.static.template, model);
    }

    function _addNewElement(e) {
        e.preventDefault();
        $("#addelementmodal").modal('hide');

        var json = app.formToJSON($(e.target))

        _list.push(json);
        var name = $("<div>Name: " + json.name + "</div>");
        var type = $("<div>Type: " + json.type + "</div>");
        var desc = $('<div></div>');

        desc.append(name);
        desc.append(type);

        var btn = $('<button class="btn btn-sm btn-danger"><i class="fas fa-trash-alt"></i></button>');
        btn.on("click", function (e) {
            console.log(e.target)
            if (e.target.tagName === "BUTTON") {
                $(e.target).parent().parent().remove();
            } else {
                $(e.target).parent().parent().parent().remove();
            }
        });

        var action = $('<div class="temp-action"></div>');
        action.append(btn);

        var card = $("<div class='temp-element'></div>");
        card.append(desc);
        card.append(action);

        $("#element-list").append(card);
    }

    $(document).ready(_init);
}());