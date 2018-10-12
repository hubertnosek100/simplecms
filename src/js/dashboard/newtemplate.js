app.newtemplate = (function () {


    var _list = [];

    function _init() {
        $('#addelementform').on("submit", _addNewElement);
        app.static.elementTypes.forEach(element => {
            $('#newtemplatetypeselect')
                .append('<option value="' + element + '">' + element + '</option>');
        });

        $("#addtemplateform").on("submit", _addTemplate);
        $('#openAddExponentModal').on("click", _default);
    }

    function _default() {
        $('#addCollectionElement').attr('disabled', true);
    }

    function _addTemplate(e) {
        e.preventDefault();

        var model = app.formToJSON($("#addtemplateform"));
        model.elements = _list;
        app.service.post("/" + app.static.template, model, _templateAdded);
    }

    function _templateAdded(data) {
        if(JSON.parse(data)){
            window.location.reload()
        }
    }

    function _addNewElement(e) {
        e.preventDefault();
        $("#addelementmodal").modal('hide');

        var json = app.formToJSON($(e.target))

        var curretnList;


        if (json.collection) {
            var collection = _list.find(function (x) {
                return x.name === json.collection
            });
            if (!collection.items) {
                collection.items = [];
            }
            curretnList = collection.items;

        } else {
            curretnList = _list;
        }

        if (!curretnList.find(function (x) {
                return x.name === json.name
            }) && !(json.collection && json.type === "collection")) {

            curretnList.push(json);
            var name = $("<div>Name: " + json.name + "</div>");
            var type = $("<div>Type: " + json.type + "</div>");
            var desc = $('<div></div>');

            desc.append(name);
            desc.append(type);

            var btn = $('<button class="btn btn-sm btn-outline-danger"><i class="fas fa-trash-alt"></i></button>');
            btn.on("click", function (e) {
                console.log(e.target)
                if (e.target.tagName === "BUTTON") {
                    $(e.target).parent().parent().remove();
                } else {
                    $(e.target).parent().parent().parent().remove();
                }
                var toDelete = curretnList.find(function (x) {
                    return x.name === json.name
                });
                var index = curretnList.indexOf(toDelete);
                if (index > -1) {
                    curretnList.splice(index, 1);
                }

            });

            var action = $('<div class="temp-action"></div>');
            action.append(btn);

            var classes = "temp-element";
            if (json.type === "collection") {
                action.append(_createCollectionBag(json.name));
                classes = classes + " temp-collection"
            }

            var id = json.name;
            if (json.collection) {
                id = "collection" + json.collection;
            }
            var card = $("<div id='" + id + "' class='" + classes + "'></div>");
            card.append(desc);
            card.append(action);

            // to change
            if (json.collection) {
                var bag = $('#' + json.collection).find(".temp-bag");
                if (bag.length == 0) {
                    bag = $('<div class="temp-bag"></div>');
                    $('#' + json.collection).append(bag);
                }
                bag.append(card)


            } else {
                $("#element-list").append(card);
            }
        } else {
            console.log("error")
        }
    }

    function _createCollectionBag(key) {
        var btn = $('<button class="btn btn-sm btn-secondary ml-2"><i class="fas fa-plus"></i></button>');
        btn.on("click", function (e) {
            e.preventDefault();
            $('#addCollectionElement').removeAttr('disabled');
            $('#addCollectionElement').val(key);
            $("#addelementmodal").modal('show');
        });
        return btn;
    }

    $(document).ready(_init);
}());