app = (function () {
    var _url;

    function _init(url, apikey) {
        app.url = url;
        app.service.set(apikey)

        $(document).ready(function () {
            app.simpletext.load(url);
            app.simpleimage.load(url);
            app.simplevideo.load(url);
            app.modal.load(url);
            app.menu.load(url);
        });
    }

    function _debounce(func, wait, immediate) {
        var timeout;
        return function () {
            var context = this,
                args = arguments;
            var later = function () {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    };

    function _formToJSON($form) {
        var unindexed_array = $form.serializeArray();
        var indexed_array = {};
        $.map(unindexed_array, function (item, index) {
            indexed_array[item['name']] = item['value'];
        });
        return indexed_array;
    }

    return {
        init: _init,
        url: _url,
        debounce: _debounce,
        formToJSON: _formToJSON
    }
}());

var simplecms = app;
app.database = (function () {
    function _init() {
        for (let i = 0; i < app.static.components.length; i++) {
            const component = app.static.components[i];
            $("#scmsTableSelect").append("<option value='" + component + "'>" + component + "</option>");
        }
        app.service.get('/' + app.static.simpletext, _set);

        $("#scmsTableSelect").on("change", _reload);
    }

    function _reload(data) {
        $("#scmsDbTable").find("tbody").empty();
        app.service.get('/' + $("#scmsTableSelect").val(), _set);
    }

    function _set(data) {
        var $tableBody = $("#scmsDbTable").find("tbody");
        data.forEach(function (el) {
            $tableBody.append(_newELement(el))
        });
    }

    function _newELement(element) {
        $row = $("<tr></tr>");
        $rmbtn = $("<button db-id='" + element.id + "' class='btn btn-danger'><i class='fas fa-trash-alt'></i></button>");

        $rmbtn.on("click", _remove);

        $idColumn = $("<td></td>").text(element.id);
        $contentColumn = $("<td></td>").text(JSON.stringify(element));
        $actionColumn = $("<td></td>").append($rmbtn);

        $row.append($idColumn);
        $row.append($contentColumn);
        $row.append($actionColumn);
        return $row;
    }

    function _remove(params) {
        var id = $(params.target).attr("db-id");
        console.log(id)
        var component = $("#scmsTableSelect").val();
        app.service.delete("/" + component + "/" + id);
        _reload();
    }

    return {
        init: _init,
        // url: _url,
        // debounce: _debounce
    }
}());
app.service = (function () {

    var _key = 'default';

    function _get(url, callback, dataType) {

        if (!dataType) {
            dataType = "json"
        }
        $.ajax({
            dataType: dataType,
            url: url,
            success: callback,
            headers: {
                "Apikey": _key
            }
        });
    }

    function _request(url, model, method) {
        $.ajax({
            type: method,
            contentType: "application/json; charset=utf-8",
            url: url,
            data: JSON.stringify(model),
            headers: {
                "Apikey": _key
            },
            success: function (data) {
                console.log("success")
            },
            error: function (data) {
                console.log("failure")
            },
            dataType: "html"
        });
    }

    function _post(url, model) {
        _request(url, model, "POST")
    }

    function _put(url, model) {
        _request(url, model, "PUT")
    }

    function _delete(url, model) {
        _request(url, model, "DELETE")
    }

    function _set(apikey) {
        _key = apikey;
    }

    return {
        post: _post,
        put: _put,
        get: _get,
        delete: _delete,
        set: _set
    }
}());
app.static = (function () {

    var _simpleimage = "simpleimage";
    var _simpletext = "simpletext";
    var _simplevideo = "simplevideo";
    var _modal = "simplemodal";
    var _exponent = "exponent";
    var _template = "template";

    var _components = [_simpletext, _simpleimage, _simplevideo, _exponent, _template];
    var _elementTypes = ["text", "number", "date", "datetime", "color", "link", "collection"];

    return {
        simpleimage: _simpleimage,
        simpletext: _simpletext,
        simplevideo: _simplevideo,
        modal: _modal,
        components: _components,
        exponent: _exponent,
        template: _template,
        elementTypes: _elementTypes
    }
}());
app.menu = (function () {

    function _load(url) {
        app.service.get(url + "/simplecms/components/menu.html", _set, "html");
    }

    function _set(data) {
        $('body').append(data);
    }

    function _init() {
        $('simpletext').contextmenu(function (e) {
            _openNav();
            e.preventDefault();
        });
        $(document).on('keydown',function(e){
            if(e.keyCode === 27){
                _closeNav();
            }
        });
    }

    function _openNav() {
        document.getElementById("mySidenav").style.width = "250px";
        // document.body.style.backgroundColor = "rgba(0,0,0,0.4)";
        $('body').append('<div id="backdrop" class="modal-backdrop fade show"></div>');
    }

    function _closeNav() {
        document.getElementById("mySidenav").style.width = "0";
        // document.body.style.backgroundColor = "white";
        $('#backdrop').remove();
    }

    $(document).ready(function () {
        _init();
    });

    return {
        load: _load,
        open: _openNav,
        close: _closeNav
    }
}())
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
var buttonBuilder = (function () {

    function _build(text, link) {
        return '<a href="' + link + '" class="btn btn-primary scms-primary scms-btn">' + text + '</a>';
    }

    return {
        build: _build,
    }
}());
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
var dateBuilder = (function () {

    function _init() {
        elementFactory.register("date", dateBuilder);
    }

    function _build(name) {
        var dispName = name;
        name = name.replace(/\s/g, '');
        var datepicker = '<div class="form-group p-2"><label>' + dispName + '</label><div class="input-group date" id="datetimepicker' + name + '" data-target-input="nearest"><input name="'+name+'" type="text" class="form-control datetimepicker-input" data-target="#datetimepicker' + name + '"><div class="input-group-append" data-target="#datetimepicker' + name + '" data-toggle="datetimepicker"><div class="input-group-text"><i class="fa fa-calendar"></i></div></div></div></div>'
        return {
            content: datepicker,
            callback: function () {
                $('#datetimepicker' + name).datetimepicker({
                    format: 'L'
                });
            }
        };
    }

    $(document).ready(_init);
    return {
        build: _build,
    }
}());
var datetimeBuilder = (function () {

    function _init() {
        elementFactory.register("datetime", datetimeBuilder);
    }

    function _build(name) {
        var dispName = name;
        name = name.replace(/\s/g,'');
        var datepicker = '<div class="form-group p-2"><label>'+ dispName+ '</label><div class="input-group date" id="datetimepicker'+name+'" data-target-input="nearest"><input name="'+name+'" type="text" class="form-control datetimepicker-input" data-target="#datetimepicker'+name+'"><div class="input-group-append" data-target="#datetimepicker'+name+'" data-toggle="datetimepicker"><div class="input-group-text"><i class="fa fa-calendar"></i></div></div></div></div>'
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
var elementFactory = (function () {

    var _builders = [];

    function _register(key, builder) {
        _builders[key] = builder;
    }

    function _build(type, name, items) {
        var builder = _builders[type];
        if (builder) {
            return builder.build(name, items);
        }
    }

    return {
        build: _build,
        register: _register
    }
}());



var linkBuilder = (function () {

    function _init() {
        elementFactory.register("link", linkBuilder);
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
var numberBuilder = (function () {

    function _init() {
        elementFactory.register("number", numberBuilder);
    }

    function _build(name) {
        var formgroup = uiBuilder.buildFormGroup(name);
        formgroup.append('<input class="form-control" required name="' + name + '" type="number"></input>');
        return formgroup;
    }

    $(document).ready(_init);
    return {
        build: _build,
    }
}());
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
var uiBuilder = (function () {

    function _buildFormGroup(name) {
        var formgroup = $('<div class="form-group p-2"></div>');
        formgroup.append('<label>' + name + '</label>')
        return formgroup;
    }

    return {
        buildFormGroup: _buildFormGroup,
    }
}());
app.dashboard = (function () {

    function _init() {
        $(document).ready(function () {
            _load();

            $('#apikeygeneratebtn').on('click', _generate);
            app.dashboard.chart();
        });
    }

    function _load() {
        app.service.get("/apikey", _set);
    }

    function _set(auth) {
        if (auth.apikey !== "default") {
            $('#apikeytext').val(auth.apikey)
        }
    }

    function _generate(params) {
        var api = _guid();
        $('#apikeytext').val(api);
        app.service.post('/apikey/', {
            apikey: api
        });
    }

    function _guid() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        var s = '';
        for (let i = 0; i < 10; i++) {
            s += s4();
        }
        return s;
    }



    return {
        init: _init
    }
}());

app.dashboard.chart = function () {

    $('input[type=radio][name=when]').change(function () {
        console.log(this.value);
        if (this.value === "daily") {
            drawDaily();
        } else if (this.value === "monthly") {
            drawMonthly();
        } else if (this.value === "yearly") {
            drawYearly();
        }
    });

    var drawYearly = function () {
        app.service.get("/requester?when=yearly", function (data) {
            var parsed = app.dashboard.yearData(data);
            draw(parsed);
        });
    }

    var drawMonthly = function () {
        app.service.get("/requester?when=monthly", function (data) {
            var parsed = app.dashboard.monthData(data);
            draw(parsed);
        });
    }

    var drawDaily = function () {
        app.service.get("/requester?when=daily", function (data) {
            var parsed = app.dashboard.hourData(data);
            draw(parsed);
        });
    }

    drawDaily();
    var draw = function (parsed) {
        var chart = c3.generate({
            bindto: '#chart-employment', // id of chart wrapper
            data: {
                columns: parsed.data,
                type: 'line', // default type of chart
                colors: parsed.colors
            },
            axis: {
                x: {
                    type: 'category',
                    // name of each category
                    categories: parsed.categories
                },
            },
            legend: {
                show: true, //hide legend
            },
            padding: {
                bottom: 0,
                top: 0
            },
        });
    }
};
app.exponents = (function () {
    function _init() {
        $(document).ready(function () {
            _load();
            $("#editJsonForm").on("submit", _send);
        });
    }

    function _load() {
        app.service.get("/" + app.static.exponent, _set);
    }

    function _set(data) {
        var $list = $('.exponents-list');

        if (data.length === 0) {
            $p = $('<p class="p-3">There is no exponents. </p>');
            var btn = buttonBuilder.build("Create new exponent", "/simplecms/dashboard/newexponent");
            $p.append(btn);
            $list.append($p)
        } else {
            data.forEach(element => {});

            var table = $('<table class="table table-hover text-center"></table>');
            var head = $('<thead class=""></thead>');
            var headTr = $('<tr> </tr>');
            headTr.append('<td>#ID</td>');
            headTr.append('<td>Template</td>');
            headTr.append('<td>Uuid</td>');
            headTr.append('<td>Action</td>');
            head.append(headTr);
            table.append(head);

            var tbody = $('<tbody></tbody>')
            data.forEach(el => {
                tbody.append(_newELement(el))
            });

            table.append(tbody);
            var btn = buttonBuilder.build("Create new exponent", "/simplecms/dashboard/newexponent");
            $list.append($('<div class="card"></div>').append(table));
            $list.append(btn);
        }
    }

    function _newELement(element) {
        $row = $("<tr></tr>");
        $rmbtn = $("<button db-id='" + element.id + "' class='btn btn-danger'><i class='fas fa-trash-alt'></i></button>");
        $editbtn = $("<button db-id='" + element.id + "' data-toggle='modal' data-target='#editJsonModal'  class='btn btn-primary ml-3' style='width: 40px;'><i class='far fa-edit'></i></i></button>");

        $rmbtn.on("click", _remove);
        $editbtn.on("click", _edit);
        $idColumn = $("<td></td>").text(element.id);
        $uuidColumn = $("<td></td>").text(element.template);
        $nameColumn = $("<td></td>").text(element.uuid);
        $actionColumn = $("<td></td>").append($rmbtn).append($editbtn);

        $row.append($idColumn);
        $row.append($uuidColumn);
        $row.append($nameColumn);
        $row.append($actionColumn);
        return $row;
    }

    function _remove(params) {
        var id = '';
        if (params.target.tagName === "BUTTON") {
            id = $(params.target).attr("db-id");
        } else {
            id = $(params.target).parent().attr("db-id");
        }
        app.service.delete("/" + app.static.exponent + "/" + id);
        _reload();
    }

    function _edit(params) {
        var id = '';
        if (params.target.tagName === "BUTTON") {

            id = $(params.target).attr("db-id");
        } else {
            id = $(params.target).parent().attr("db-id");
        }

        app.service.get("/" + app.static.exponent + '/' + id, function (data) {
            $('#editJsonText').val(JSON.stringify(data))
        });
    }

    function _send(e) {
        e.preventDefault();
        var model = JSON.parse($('#editJsonText').val());
        app.service.put("/" + app.static.exponent + '/' + model.id, model);
        $('#editJsonModal').modal('hide');
    }

    function _reload() {
        $('.exponents-list').empty();
        _load();
    }


    return {
        init: _init
    }
}());
var media = (function () {

    function _init() {
        app.service.get('/media', _set);
    }

    function _set(data) {
        var $list = $('.media-list')

        if (data.length === 0) {
            $p = $('<p class="p-3">There is no media. </p>');
            $list.append($p)
        } else {
            var table = $('<table class="table table-hover text-center"></table>');
            var head = $('<thead class=""></thead>');
            var headTr = $('<tr> </tr>');
            headTr.append('<td>name</td>');
            head.append(headTr);
            table.append(head);

            var tbody = $('<tbody></tbody>')
            data.forEach(el => {
                tbody.append(_newELement(el))
            });

            table.append(tbody);
            $list.append($('<div class="card"></div>').append(table));
        }
    }

    function _newELement(element) {
        $row = $("<tr></tr>");
        $col = $("<td></td>").text(element);
        $row.append($col);
        return $row;
    }


    return {
        init: _init
    }
}());

app.media = media;
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
        debugger
        var id = $(colForm).attr('id');
        model[id] = [];

        forms.forEach((el) => {
            model[id].push(app.formToJSON($(el)));
        });
        debugger

        model.templateid = $("#newtemplateselect").val();
        model.template = $("#newtemplateselect option:selected").text();
        app.service.post("/" + app.static.exponent, model)
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
        app.service.post("/" + app.static.template, model);
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

            var btn = $('<button class="btn btn-sm btn-danger"><i class="fas fa-trash-alt"></i></button>');
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
app.template = (function () {
    function _init() {
        $(document).ready(function () {
            _load();
            $("#editJsonForm").on("submit", _send);
        });
    }

    function _load() {
        app.service.get("/" + app.static.template, _set);
    }

    function _set(data) {
        var $list = $('.template-list');

        if (data.length === 0) {
            $p = $('<p class="p-3">You have no templates. </p>');
            var btn = buttonBuilder.build("Create new template", "/simplecms/dashboard/newtemplate");
            $p.append(btn);
            $list.append($p)
        } else {
            var table = $('<table class="table table-hover text-center"></table>');
            var head = $('<thead class=""></thead>');
            var headTr = $('<tr> </tr>');
            headTr.append('<td>#ID</td>');
            headTr.append('<td>@uuid</td>');
            headTr.append('<td>Name</td>');
            headTr.append('<td>Action</td>');
            head.append(headTr);
            table.append(head);

            var tbody = $('<tbody></tbody>')
            data.forEach(el => {
                tbody.append(_newELement(el))
            });

            table.append(tbody);
            var btn = buttonBuilder.build("Create new template", "/simplecms/dashboard/newtemplate");
            $list.append($('<div class="card"></div>').append(table));
            $list.append(btn);
        }
    }

    function _newELement(element) {
        $row = $("<tr></tr>");
        $rmbtn = $("<button db-id='" + element.id + "' class='btn btn-danger'><i class='fas fa-trash-alt'></i></button>");
        $editbtn = $("<button db-id='" + element.id + "' data-toggle='modal' data-target='#editJsonModal' class='btn btn-primary ml-3' style='width: 40px;'><i class='far fa-edit'></i></i></button>");

        $rmbtn.on("click", _remove);
        $editbtn.on("click", _edit);

        $idColumn = $("<td></td>").text(element.id);
        $uuidColumn = $("<td></td>").text(element.uuid);
        $nameColumn = $("<td></td>").text(element.name);
        $actionColumn = $("<td></td>").append($rmbtn).append($editbtn);

        $row.append($idColumn);
        $row.append($uuidColumn);
        $row.append($nameColumn);
        $row.append($actionColumn);
        return $row;
    }

    function _remove(params) {
        var id = '';
        if (params.target.tagName === "BUTTON") {
            id = $(params.target).attr("db-id");
        } else {
            id = $(params.target).parent().attr("db-id");
        }
        app.service.delete("/" + app.static.template + "/" + id);
        _reload();
    }


    function _edit(params) {
        var id = '';
        if (params.target.tagName === "BUTTON") {

            id = $(params.target).attr("db-id");
        } else {
            id = $(params.target).parent().attr("db-id");
        }

        app.service.get("/" + app.static.template + '/' + id, function (data) {
            $('#editJsonText').val(JSON.stringify(data))
        });
    }

    function _send(e) {
        e.preventDefault();
        var model = JSON.parse($('#editJsonText').val());
        app.service.put("/" + app.static.template + '/' + model.id, model);
        $('#editJsonModal').modal('hide');
    }


    function _reload() {
        $('.template-list').empty();
        _load();
    }


    return {
        init: _init
    }
}());
app.simpleimage = (function () {

    function _load(url) {
        app.service.get(url + "/" + app.static.simpleimage, _set);
        _init();
    }

    function _init() {
        $simpleimages = $(app.static.simpleimage);
        $simpleimages.each(function (idx, el) {
            $(el).append("<img class='pointer default' src='" + el.url + "'/>");
            var classes = $(el).attr("class");
            $(el).find('img').attr("class", classes);
            $(el).find('img').unbind();
            $(el).find('img').on("click", function () {
                app.modal.create(_setLocal, {
                    uuid: $(el).attr('uuid')
                }, "Set image url", "Image url...", app.url + "/simpleimage", "url");
            });
        });
    }

    function _set(data) {
        data.forEach(function (el) {
            $simpleimage = $(app.static.simpleimage + "[uuid='" + el.uuid + "'");
            $simpleimage.attr("db-id", el.id);
            if (el.url !== "") {
                $simpleimage.find('img').attr('src', el.url);
                $simpleimage.find('img').removeClass('default');
            }

            $simpleimage.find('img').unbind();
            $simpleimage.find('img').on("click", function () {
                app.modal.create(_setLocal, {
                    id: el.id,
                    uuid: el.uuid
                }, "Set image url", "Image url...", app.url + "/simpleimage", "url");
            });
        });
    }

    function _setLocal(data, uuid) {
        $element = $(app.static.simpleimage + "[uuid='" + uuid + "'");
        $element.find('img').attr("src", data);
        if (data !== "") {
            $element.find('img').removeClass('default');
        } else {
            $element.find('img').addClass('default');
        }
    }

    return {
        load: _load
    }
}());
app.simpletext = (function () {

    function _load(url) {
        app.service.get(url + "/" + app.static.simpletext, _set);
        _init();
    }

    function _init() {
        $simpletexts = $(app.static.simpletext);
        $simpletexts.each(function (idx, el) {
            $(el).attr('contenteditable', true);
            $(el).attr('data-placeholder', "Insert text here...");
            var save = app.debounce(_save, 1000);
            $(el).on('keyup', function (evt, el) {
                save(evt, el);
            });
        });
    }

    function _save(el) {
        var text = $(el.target).text();
        var uuid = $(el.target).attr('uuid');
        var id = $(el.target).attr('db-id');
        if (id) {
            app.service.put(app.url + "/" + app.static.simpletext + "/" + id, {
                id: id,
                uuid: uuid,
                text: text
            })
        } else {
            app.service.post(app.url + "/" + app.static.simpletext, {
                uuid: uuid,
                text: text
            })
        }
    }

    function _set(data) {
        data.forEach(function (el) {
            $simpletext = $(app.static.simpletext + "[uuid='" + el.uuid + "'");
            $simpletext.text(el.text);
            $simpletext.attr("db-id", el.id);
        });
    }

    return {
        load: _load
    }
}());
app.simplevideo = (function () {

    function _load(url) {
        app.service.get(url + "/" + app.static.simplevideo, _set);
        _init();
    }

    function _init() {
        $simplevideos = $(app.static.simplevideo);
        $simplevideos.each(function (idx, el) {
            $(el).append("<video controls class='pointer default' src='" + el.url + "'/>");
            var classes = $(el).attr("class");
            $(el).find('video').attr("class", classes);
            $(el).find('video').unbind();
            $(el).find('video').on("click", function () {
                app.modal.create(_setLocal, {
                    uuid: $(el).attr('uuid')
                }, "Set video url", "Video url...", app.url + "/simplevideo", "url");
            });
        });
    }

    function _set(data) {
        data.forEach(function (el) {
            $simplevideo = $(app.static.simplevideo + "[uuid='" + el.uuid + "'");
            $simplevideo.attr("db-id", el.id);
            if (el.url !== "") {
                $simplevideo.find('video').attr('src', el.url);
                $simplevideo.find('video').removeClass('default');
            }

            $simplevideo.find('video').unbind();
            $simplevideo.find('video').on("click", function () {
                app.modal.create(_setLocal, {
                    id: el.id,
                    uuid: el.uuid
                }, "Set video url", "Video url...", app.url + "/simplevideo", "url");
            });
        });
    }

    function _setLocal(data, uuid) {
        $element = $(app.static.simplevideo + "[uuid='" + uuid + "'");
        $element.find('video').attr("src", data);
        if (data !== "") {
            $element.find('video').removeClass('default');
        } else {
            $element.find('video').addClass('default');
        }
    }

    return {
        load: _load
    }
}());
app.dashboard.hourData = function (data) {
    var names = [];
    var columns = [];
    var colors = {};
    var cl = [tabler.colors["orange"],
        tabler.colors["blue"],
        tabler.colors["green"],
        tabler.colors["red"],
        tabler.colors["yellow"],
        tabler.colors["purple"]
    ];

    for (var timestamp in data) {
        if (data.hasOwnProperty(timestamp)) {
            for (var col in data[timestamp]) {
                if (data[timestamp].hasOwnProperty(col)) {
                    if (names.indexOf(col) === -1) {
                        names.push(col);
                        var ar = [];
                        ar.push(col);
                        columns.push(ar)
                        colors[col] = cl[names.length];
                    }
                }
            }
        }
    }

    var categories = [];

    var obj = {};
    for (let j = 0; j < names.length; j++) {
        obj[names[j]] = 0;
    }

    var sorted = {};
    var a = new Date();
    for (let j = 0; j < a.getHours() + 1; j++) {
        var timestamp = (a.getMonth() + 1) + '/' + a.getDate() + '/' + a.getFullYear() + '.' + j;
        if (!data.hasOwnProperty(timestamp)) {
            sorted[timestamp] = obj;
        } else {
            sorted[timestamp] = data[timestamp];
        }
    }
    for (var timestamp in sorted) {
        categories.push(timestamp.slice(9, 11))
        if (sorted.hasOwnProperty(timestamp)) {
            for (let j = 0; j < names.length; j++) {
                var value = 0;
                if (sorted[timestamp].hasOwnProperty(names[j])) {
                    value = sorted[timestamp][names[j]]
                }
                columns[j].push(value)
            }
        }
    }
    return {
        categories: categories,
        colors: colors,
        data: columns
    }
}
app.dashboard.monthData = function (data) {
    var names = [];
    var columns = [];
    var colors = {};
    var cl = [tabler.colors["orange"],
        tabler.colors["blue"],
        tabler.colors["green"],
        tabler.colors["red"],
        tabler.colors["yellow"],
        tabler.colors["purple"]
    ];

    var monthly = {};

    for (var timestamp in data) {
        if (data.hasOwnProperty(timestamp)) {
            for (var col in data[timestamp]) {
                if (data[timestamp].hasOwnProperty(col)) {
                    if (names.indexOf(col) === -1) {
                        names.push(col);
                        var ar = [];
                        ar.push(col);
                        columns.push(ar)
                        colors[col] = cl[names.length];
                       
                    }

                    var month = timestamp.split('/')[1];
                    if (!monthly[month]) {
                        monthly[month] = {}
                    }
                    if (monthly[month][col]) {
                        monthly[month][col] = data[timestamp][col] + monthly[month][col];
                    } else {
                        monthly[month][col] = data[timestamp][col];
                    }
                }
            }
        }
    }

    var categories = [];

    var obj = {};
    for (let j = 0; j < names.length; j++) {
        obj[names[j]] = 0;
    }
    
    var sorted = {};
    var a = new Date();
    for (let j = 0; j < a.getDate() + 1; j++) {
        if (!monthly.hasOwnProperty(j)) {
            sorted[j] = obj;
        } else {
            sorted[j] = monthly[j];
        }
    }

    for (var timestamp in sorted) {
        categories.push(timestamp)
        if (sorted.hasOwnProperty(timestamp)) {
            for (let j = 0; j < names.length; j++) {
                var value = 0;
                if (sorted[timestamp].hasOwnProperty(names[j])) {
                    value = sorted[timestamp][names[j]]
                }
                columns[j].push(value)
            }
        }
    }
    return {
        categories: categories,
        colors: colors,
        data: columns
    }
}
app.dashboard.yearData = function (data) {
    var names = [];
    var columns = [];
    var colors = {};
    var cl = [tabler.colors["orange"],
        tabler.colors["blue"],
        tabler.colors["green"],
        tabler.colors["red"],
        tabler.colors["yellow"],
        tabler.colors["purple"]
    ];

    var yearly = {};

    for (var timestamp in data) {
        if (data.hasOwnProperty(timestamp)) {
            for (var col in data[timestamp]) {
                if (data[timestamp].hasOwnProperty(col)) {
                    if (names.indexOf(col) === -1) {
                        names.push(col);
                        var ar = [];
                        ar.push(col);
                        columns.push(ar)
                        colors[col] = cl[names.length];
                       
                    }
                    var year = timestamp.split('/')[0];
                    if (!yearly[year]) {
                        yearly[year] = {}
                    }
                    if (yearly[year][col]) {
                        yearly[year][col] = data[timestamp][col] + yearly[year][col];
                    } else {
                        yearly[year][col] = data[timestamp][col];
                    }
                }
            }
        }
    }

    var categories = [];

    var obj = {};
    for (let j = 0; j < names.length; j++) {
        obj[names[j]] = 0;
    }
    
    var sorted = {};
    var a = new Date();
    for (let j = 1; j < a.getMonth() + 2; j++) {
        if (!yearly.hasOwnProperty(j)) {
            sorted[j] = obj;
        } else {
            sorted[j] = yearly[j];
        }
    }


    for (var timestamp in sorted) {
        categories.push(timestamp)
        if (sorted.hasOwnProperty(timestamp)) {
            for (let j = 0; j < names.length; j++) {
                var value = 0;
                if (sorted[timestamp].hasOwnProperty(names[j])) {
                    value = sorted[timestamp][names[j]]
                }
                columns[j].push(value)
            }
        }
    }
    return {
        categories: categories,
        colors: colors,
        data: columns
    }
}