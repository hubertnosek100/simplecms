var collectionBuilder = (function () {

    function _init() {
        elementFactory.register("collection", collectionBuilder);
    }

    function _build(name, items) {
        var formgroup = uiBuilder.buildFormGroup(name);
        var form = $('<form class="expo-form" id ="' + name + '"></form>');

        formgroup.append(_createCollectionBag(name, items));
        form.append(formgroup);
        return form;
    }

    function _createCollectionBag(name, items) {
        var btn = $('<button class="form-control btn btn-sm btn-secondary ml-2"><i class="fas fa-plus"></i></button>');
        btn.on("click", function (e) {
            e.preventDefault();
            var expoEl = $('<form class="expo-element"></form>')
            expoEl.append(_createRmButton())
            if (items.length > 0) {
                items.forEach(element => {
                    var uiEl = elementFactory.build(element.type, element.name, element.items);
                    if (uiEl && uiEl.callback) {
                        expoEl.append(uiEl.content);
                        uiEl.callback();
                    } else {
                        expoEl.append(uiEl);
                    }
                });
            }
            $('#' + name).append(expoEl)
        });
        return btn;
    }


    function _createRmButton() {
        var btn = $('<button class="btn btn-sm btn-danger"><i class="fas fa-trash-alt"></i></button>');
        btn.on("click", function (e) {
            console.log(e.target)
            if (e.target.tagName === "BUTTON") {
                $(e.target).parent().parent().remove();
            } else {
                $(e.target).parent().parent().parent().remove();
            }
        });

        var formgroup = $('<div style="margin:3px;"></div>')
        formgroup.append(btn)
        return formgroup;
    }

    $(document).ready(_init);
    return {
        build: _build,
    }
}());