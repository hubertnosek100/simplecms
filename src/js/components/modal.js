app.modal = (function () {

    function _load(url) {
        app.service.get(url + "/simplecms/components/modal.html", _set, "html");
    }

    function _set(data) {
        $('body').append(data);
    }

    function _create(callback, model, title, placeholder, url, property) {

        $("#simplemodal").modal();
        $("#simplemodal").find('input').attr("placeholder", placeholder);
        $("#simpleModalLabel").text(title);
        $("#simpleModalSave").unbind();
        $("#simpleModalSave").on("click", function () {
            model[property] = $("#simplemodal").find('input').val();
            if (model.id) {
                app.service.put(url + "/" + model.id, model)
            } else {
                app.service.post(url, model)
            }
            $('#simplemodal').modal("hide");
            callback(model[property], model.uuid);
        });
    }

    return {
        load: _load,
        create: _create
    }
}());