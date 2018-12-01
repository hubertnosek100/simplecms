app = (function () {
    var _url;

    function _init(options) {
        app.url = options.url;
        app.service.set(options.apikey, options.defaultLang)
        $(document).ready(function () {
            app.simpletext.load(options.url);
            app.simpleimage.load(options.url);
            app.simplevideo.load(options.url);
            app.simplelanguage.load(options.url);
            app.simplecontainer.load(options.url);
            app.modal.load(options.url);
            app.menu.load(options.url);
            app.simpleeditor.listenForCombination();
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

    function _goTo(url) {
        window.location.href = url;
    }

    return {
        init: _init,
        url: _url,
        debounce: _debounce,
        formToJSON: _formToJSON,
        goTo: _goTo
    }
}());

var simplecms = app;
app.database = (function () {
    var _pager;
    function _init() {
        _pager =  app.ui.pager;
        _pager.onChanged(_reload)
        $("#scmsDbTable").parent().append(_pager.build())

        for (let i = 0; i < app.static.components.length; i++) {
            const component = app.static.components[i];
            $("#scmsTableSelect").append("<option value='" + component + "'>" + component + "</option>");
        }
        app.service.get('/' + app.static.simpletext + _pager.getQuery(), _set);

        $("#scmsTableSelect").on("change", _changed);
    }

    function _changed(){
        _pager.reset();
        _reload();
    }

    function _reload(data) {
        $("#scmsDbTable").find("tbody").empty();
        app.service.get('/' + $("#scmsTableSelect").val() + _pager.getQuery(), _set);
    }

    function _set(data) {
        var $tableBody = $("#scmsDbTable").find("tbody");
       

        data.forEach(function (el) {
            $tableBody.append(_newELement(el))
        });
    }

    function _newELement(element) {
        $row = $("<tr></tr>");
        $rmbtn = $("<button db-id='" + element.id + "' class='btn btn-outline-danger'><i class='fas fa-trash-alt'></i></button>");

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
        var id = '';
        if (params.target.tagName === "BUTTON") {
            id = $(params.target).attr("db-id");
        } else {
            id = $(params.target).parent().attr("db-id");
        }
        var component = $("#scmsTableSelect").val();
        app.service.delete("/" + component + "/" + id);
        _reload();
    }

    return {
        init: _init,
    }
}());
app.service = (function () {

    var _key = 'default';
    var _defaultLang = undefined;
    var _lang = undefined;

    function _get(url, callback, dataType, model) {
        if (!dataType) {
            dataType = "json"
        }

        var char = '?';
        if (url.indexOf('?') !== -1) char = '&';
        if ((_defaultLang !== undefined)) {
            url += char + "lang=" + _lang + "";
        }

        $.ajax({
            dataType: dataType,
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(model),
            url: url,
            success: callback,
            headers: {
                "Apikey": _key
            }
        });
    }

    function _request(url, model, method, callback, dataType) {
        if (!dataType) {
            dataType = "html"
        }

        if(model){
            if (!model.lang) {
                model.lang = "";
            }
    
            if (localStorage["lang"]) {
                model.lang = localStorage["lang"];
            }
        }

        $.ajax({
            type: method,
            contentType: "application/json; charset=utf-8",
            url: url,
            data: JSON.stringify(model),
            headers: {
                "Apikey": _key,
                "token": _getCookie('simplecms_token')
            },
            success: function (data) {
                console.log("success")
                if (callback) callback(data);
            },
            error: function (data) {
                console.log("failure")
                if (callback) callback(data);
            },
            dataType: dataType
        });
    }

    function _post(url, model, callback, dataType) {
        _request(url, model, "POST", callback, dataType)
    }

    function _put(url, model) {
        _request(url, model, "PUT")
    }

    function _delete(url, model) {
        _request(url, model, "DELETE")
    }

    function _set(apikey, lang) {
        _key = apikey;
        _defaultLang = lang;
        _lang = localStorage["lang"];
    }

    function _changeLanguage(code) {
        localStorage.setItem("lang", code);
        _setCookie("lang", code, 1);
        window.location.reload();
    }

    function _getCookie(cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }

    function _setCookie(cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        var expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }

    function _isAuthenticated(callback) {
        _post(app.url + '/api/check', {}, function (data) {
            console.log(JSON.stringify(data))
            callback(data.succes)
        }, 'json')
    }

    function _login(model, onSuccess) {
        _post(app.url + '/api/login', model, function (data) {
            if (data.token) {
                _setCookie("simplecms_token", data.token, 1)
                onSuccess(true)
            }
        }, 'json')
    }

    return {
        post: _post,
        put: _put,
        get: _get,
        delete: _delete,
        set: _set,
        isAuthenticated: _isAuthenticated,
        login: _login,
        changeLanguage: _changeLanguage
    }
}());
app.static = (function () {

    var _simpleimage = "simpleimage";
    var _simpletext = "simpletext";
    var _simplevideo = "simplevideo";
    var _simplecontainer = "simplecontainer";
    var _modal = "simplemodal";
    var _exponent = "exponent";
    var _template = "template";
    var _simplelanguage = "simplelanguage";

    var _components = [_simpletext, _simpleimage, _simplevideo, _exponent, _template, _simplecontainer];
    var _elementTypes = ["text", "number", "date", "datetime", "color", "link", "collection"];

    return {
        simpleimage: _simpleimage,
        simpletext: _simpletext,
        simplevideo: _simplevideo,
        simplecontainer: _simplecontainer,
        modal: _modal,
        components: _components,
        exponent: _exponent,
        template: _template,
        elementTypes: _elementTypes,
        simplelanguage: _simplelanguage
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
            $('#' + name).append(expoEl)
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
        });
        return btn;
    }


    function _createRmButton() {
        var btn = $('<button class="btn btn-sm btn-outline-danger"><i class="fas fa-trash-alt"></i></button>');
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
app.menu = (function () {
    var _current = undefined
    function _load(url) {
        app.service.get(url + "/simplecms/components/menu.html", _set, "html");
    }

    function _set(data) {
        $('body').append(data);
        $('#loginForm').on('submit', function (e) {
            e.preventDefault()
            var model = app.formToJSON($(e.target))
            app.service.login(model, _drawAuth)
        })
        $('#faviconId').attr('src', app.url + '/favicon.png')
    }

    function _init() {
        $('simpletext').contextmenu(function (e) {
            app.menuComponent(e.target)
            _openNav();
            e.preventDefault();
        });
        $(document).on('keydown', function (e) {
            if (e.keyCode === 27) {
                _closeNav();
            }
        });
    }

    function _openNav() {
        document.getElementById("mySidenav").style.width = "300px";
        $('body').append('<div id="backdrop" class="modal-backdrop fade show"></div>');
    }

    function _closeNav() {
        document.getElementById("mySidenav").style.width = "0";
        $('#backdrop').remove();
    }

    function _loginTab(params) {
        app.service.isAuthenticated(_drawAuth);
    }

    function _drawAuth(auth) {
        if (auth) {
            $('#loginForm').hide()
            $('#loginInfo').show()
        } else {
            $('#loginInfo').hide()
            $('#loginForm').show()
        }
    }

    return {
        load: _load,
        open: _openNav,
        close: _closeNav,
        current: _current,
        loginTab: _loginTab,
        init: _init
    }
}())
app.menuComponent = function (target) {
    let tagName = target.tagName.toLocaleLowerCase();

    var _draw = function (el, uuid) {
        try {
            var css = JSON.parse($(el).val())
            var obj = $(tagName + '[uuid="' + uuid + '"]');
            app.simpleeditor.clearStyles(obj[0])
            for (var style in css) {
                if (css.hasOwnProperty(style)) {
                    obj.css(style, css[style]);
                }
            }
            app[tagName].save({
                target: obj[0]
            })
            $('#componenJsonHelp').text("")
        } catch (err) {
            $('#componenJsonHelp').text("Not valid Json")
        }
    }

    var found = function (data) {
        var el = app.simpleeditor.unwrap(data)
        if (el) {
            app.menu.current = el;
            $('#componentUuid').val(el.uuid)
            $('#componentJsonCss').val(JSON.stringify(el.css, undefined, 4));

            var draw = app.debounce(_draw, 1000);
            $('#componentJsonCss').unbind();
            $('#componentJsonCss').on('keyup', function (evt) {
                draw(evt.target, el.uuid);
            });
        }
    };
    var uuid = $(target).attr('uuid');
    app[tagName].find(app.url, uuid, found);
};
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
        $rmbtn = $("<button db-id='" + element.id + "' class='btn btn-outline-danger'><i class='fas fa-trash-alt'></i></button>");
        $editbtn = $("<button db-id='" + element.id + "' data-toggle='modal' data-target='#editJsonModal'  class='btn btn-outline-primary ml-3' style='width: 40px;'><i class='far fa-edit'></i></i></button>");

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
            $('#editJsonText').val(JSON.stringify(data, undefined, 4))
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
var lang = (function () {

    function _init() {
        app.service.get('/lang', _set);
    }

    function _set(data) {

        var $list = $('.lang-list')
        $('.lang-list').empty();
        if (data.length === 0) {
            $p = $('<p class="p-3">There is no languages. </p>');
            $list.append($p)
        } else {
            var table = $('<table class="table table-hover text-center"></table>');
            var head = $('<thead class=""></thead>');
            var headTr = $('<tr> </tr>');
            headTr.append('<td>Image</td>');
            headTr.append('<td>Code</td>');
            headTr.append('<td>Placeholder</td>');
            headTr.append('<td>Action</td>');
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
        var $img = $('<img style="height:40px; width:40px" src= "' + element.url + '"/>')
        var $rmBtn = $("<button data-name='" + element.code + "' class='btn btn-outline-danger ml-3'><i class='fas fa-trash-alt'></i></button>");
        $rmBtn.on('click', _remove)

        return $("<tr></tr>")
            .append($("<td></td>").append($img))
            .append($("<td></td>").text(element.code))
            .append($("<td></td>").text(element.placeholder))
            .append($("<td></td>").append($rmBtn));
    }


    function _remove(e) {
        var name = ''
        if (e.target.tagName === "BUTTON") {
            name = $(e.target).attr('data-name')
        } else {
            name = $(e.target).parent().attr("data-name");
        }

        app.service.post("/removelang/", {
            code: name
        });
        _reload();
    }

    function _reload() {
        $('.media-list').empty();
        _init();
    }

    return {
        init: _init
    }
}());

app.lang = lang;
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
            headTr.append('<td>Preview</td>');
            headTr.append('<td>Name</td>');
            headTr.append('<td>Action</td>');
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
        $copyCol = $("<td></td>")
        $imgCol = $("<td></td>")

        var url = _makeMediaUrl(element)
        $imgCol.append('<img style="height:40px; width:40px" src= "' + url + '"/>')
        var $copyBtn = $("<button data-url='" + url + "' class='btn btn-outline-dark'><i class='fas fa-copy'></i></button>");
        $copyBtn.on('click', _copyToCliboard)
        $copyCol.append($copyBtn)

        var $rmBtn = $("<button data-name='" + element + "' class='btn btn-outline-danger ml-3'><i class='fas fa-trash-alt'></i></button>");
        $rmBtn.on('click', _remove)
        $copyCol.append($rmBtn)

        $row.append($imgCol);
        $row.append($col);
        $row.append($copyCol);
        return $row;
    }

    function _makeMediaUrl(param) {
        return app.url + '/uploaded/' + param;
    }

    function _copyToCliboard(e) {
        var text = ''
        if (e.target.tagName === "BUTTON") {
            text = $(e.target).attr('data-url')
        } else {
            text = $(e.target).parent().attr("data-url");
        }

        var $temp = $("<input>");
        $("body").append($temp);
        $temp.val(text).select();
        document.execCommand("copy");
        $temp.remove();
    }

    function _remove(e) {
        var name = ''
        if (e.target.tagName === "BUTTON") {
            name = $(e.target).attr('data-name')
        } else {
            name = $(e.target).parent().attr("data-name");
        }

        app.service.post("/removemedia/", {
            name: name
        });
        _reload();
    }

    function _reload() {
        $('.media-list').empty();
        _init();
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
        $rmbtn = $("<button db-id='" + element.id + "' class='btn btn-outline-danger'><i class='fas fa-trash-alt'></i></button>");
        $editbtn = $("<button db-id='" + element.id + "' data-toggle='modal' data-target='#editJsonModal' class='btn btn-outline-primary ml-3' style='width: 40px;'><i class='far fa-edit'></i></i></button>");

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
            $('#editJsonText').val(JSON.stringify(data, undefined, 4))
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
app.simplecontainer = (function () {

    function _load(url) {
        var containers = $(app.static.simplecontainer)
        for (let i = 0; i < containers.length; i++) {
            const $cont = $(containers[i]);
            _find(url, $cont.attr("uuid"), function (data) {
                var el = app.simpleeditor.unwrap(data)
                if (el) {
                    $cont.attr("db-id", el.id);
                    // todo function writeStyles!
                    var css = el.css
                    for (var style in css) {
                        if (css.hasOwnProperty(style)) {
                            $cont.css(style, css[style]);
                        }
                    }
                } else {
                    _save({
                        target: $cont[0]
                    })
                }
            });
        }
    }

    function _find(url, uuid, callback) {
        app.service.get(url + "/" + app.static.simplecontainer + '?uuid=' + uuid, callback);
    }

    function _save(el) {
        var uuid = $(el.target).attr('uuid');
        var id = $(el.target).attr('db-id');
        var css = app.simpleeditor.readStyles(el.target);
        if (id) {
            app.service.put(app.url + "/" + app.static.simplecontainer + "/" + id, {
                id: id,
                uuid: uuid,
                css: css
            })
        } else {
            app.service.post(app.url + "/" + app.static.simplecontainer, {
                uuid: uuid,
                css: css
            })
        }
    }


    function _makeEditable() {
        var editButton = $('<button type="button" class="btn btn-primary scms-primary scms-btn btn-sm">EDIT</button>')
        var editAble = $('<div class="container-editable"></div>')
        editButton.on('click', _edit)
        editAble.append(editButton)
        $(app.static.simplecontainer).prepend(editAble)
        $(app.static.simplecontainer).addClass('editable')
    }

    function _edit(e) {
        app.menu.open();
        app.menuComponent($(e.target).parent().parent()[0])
    }

    return {
        load: _load,
        save: _save,
        init: _makeEditable,
        find: _find
    }
}());
app.simpleeditor = (function () {

    function _listenForCombination(params) {
        var keys = {
            shift: false,
            ctrl: false,
            e: false
        };
        var done = false;
        $(document.body).keydown(function (e) {
            // console.log(e.key)
            // console.log(e.keyCode)
            if (e.keyCode == 16) {
                keys["shift"] = true;
            } else if (e.keyCode == 17) {
                keys["ctrl"] = true;
            } else if (e.keyCode == 69) {
                keys["e"] = true;
            }
            if (keys["shift"] && keys["ctrl"] && keys["e"]) {
                if (!done) {
                    done = true
                    app.simplevideo.init();
                    app.simpleimage.init();
                    app.simpletext.init();
                    app.simplecontainer.init();
                    app.menu.init();
                }
            }
        });

        $(document.body).keyup(function (e) {
            // reset status of the button 'released' == 'false'
            if (e.keyCode == 16) {
                keys["shift"] = false;
            } else if (e.keyCode == 17) {
                keys["ctrl"] = false;
            } else if (e.keyCode == 69) {
                keys["e"] = false;
            }
        });
    }

    function _readStyles(el) {
        var styles = {};
        var i = 0;
        while (el.style[i]) {
            styles[el.style[i]] = el.style[el.style[i]]
            i++;
        }
        return styles;
    }

    function _clearStyles(obj) {
        var s = obj.style;
        while (s[0]) {
            s[s[0]] = ""
        }
    }

    function _unwrap(data) {
        if (data instanceof Array) {
            if (data.length > 0) {
                return data[0];
            }
        } else {
            return data;
        }
    }

    return {
        listenForCombination: _listenForCombination,
        readStyles: _readStyles,
        clearStyles: _clearStyles,
        unwrap: _unwrap
    }
}())
app.simpleimage = (function () {

    function _load(url) {
        app.service.get(url + "/" + app.static.simpleimage, _set);
        _init()
    }

    function _init() {
        $simpleimages = $(app.static.simpleimage);
        $simpleimages.each(function (idx, el) {
            $(el).append("<img class='default' src='" + el.url + "'/>");
            var classes = $(el).attr("class");
            $(el).find('img').attr("class", classes);
        });
    }

    function _makeEditbale() {
        $simpleimages = $(app.static.simpleimage);
        $simpleimages.each(function (idx, el) {
            $(el).find('img')
                .unbind()
                .addClass('pointer');

            $(el).find('img').on("click", function () {
                var uuid = $(el).attr('uuid')
                var image = $(app.static.simpleimage + "[uuid='" + uuid + "']").find("img");
                var src = image.attr('src')
                app.modal.create(_setLocal, {
                    uuid: $(el).attr('uuid'),
                    url: src
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
        load: _load,
        init: _makeEditbale
    }
}());
app.simplelanguage = (function () {
    function _init(url) {
        app.service.get(url + '/lang', _set);
    }

    function _set(data) {
        $simplelanguage = $(app.static.simplelanguage);
        $simplelanguage.each(function (idx, el) {
            var select = $('<div class="dropdown"></div>')
            select.append(' <button class="btn btn-outline-primary dropdown-toggle" type="button" id="dropdownLanguagesMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Languages</button>')
            var container = $('<div class="dropdown-menu" aria-labelledby="dropdownLanguagesMenuButton"></div>')
            data.forEach(function (lang) {
                var opt = $('<a data-code="' + lang.code + '" class="dropdown-item"></a>')
                opt.append('<img style="height:40px; width:40px"  src="' + lang.url + '"/>');
                opt.append('<span style="margin-left:10px;">' + lang.placeholder + '</span>');
                opt.on('click', _changeLanguage);
                container.append(opt)
            })
            $(select).append(container)
            $(el).append(select);
        });
    }

    function _changeLanguage(el) {
        var target = $(el.target);
        if (el.target.nodeName !== "A") {
            target = $(target).parent();
        }
        var code = target.attr('data-code');
        app.service.changeLanguage(code);
    }

    return {
        load: _init
    }
}());
app.simpletext = (function () {

    function _find(url, uuid, callback) {
        app.service.get(url + "/" + app.static.simpletext + '?uuid=' + uuid, callback);
    }

    function _load(url) {
        app.service.get(url + "/" + app.static.simpletext, _set);
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
        var css = app.simpleeditor.readStyles(el.target);
        if (id) {
            app.service.put(app.url + "/" + app.static.simpletext + "/" + id, {
                id: id,
                uuid: uuid,
                text: text,
                css: css
            })
        } else {
            app.service.post(app.url + "/" + app.static.simpletext, {
                uuid: uuid,
                text: text,
                css: css
            })
        }
    }

    function _set(data) {
        data.forEach(function (el) {
            $simpletext = $(app.static.simpletext + "[uuid='" + el.uuid + "'");
            $simpletext.text(el.text);
            $simpletext.attr("db-id", el.id);
            var css = el.css
            for (var style in css) {
                if (css.hasOwnProperty(style)) {
                    $simpletext.css(style, css[style]);
                }
            }
        });
    }

    return {
        load: _load,
        find: _find,
        save: _save,
        init: _init
    }
}());
app.simplevideo = (function () {

    function _load(url) {
        app.service.get(url + "/" + app.static.simplevideo, _set);
        _init()
    }

    function _init() {
        $simplevideos = $(app.static.simplevideo);
        $simplevideos.each(function (idx, el) {
            $(el).append("<video controls class='default' src='" + el.url + "'/>");
            var classes = $(el).attr("class");
            $(el).find('video').attr("class", classes);
        });
    }

    function _makeEditbale() {
        $simplevideos = $(app.static.simplevideo);
        $simplevideos.each(function (idx, el) {
            $(el).find('video')
                .unbind()
                .addClass('pointer');
            $(el).find('video').on("click", function () {
                var uuid = $(el).attr('uuid')
                var video = $(app.static.simplevideo + "[uuid='" + uuid + "']").find("video");
                var src = video.attr('src')
                app.modal.create(_setLocal, {
                    uuid: $(el).attr('uuid'),
                    url: src
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
        load: _load,
        init: _makeEditbale
    }
}());
app.ui = app.ui ? app.ui : {};
app.ui.pager = (function () {
    var obj = {};

    obj.page = 1;
    obj.limit = 10;

    obj.nav = $('<nav class="w-100 d-flex justify-content-center" aria-label="Page navigation"></nav>');
    obj.ul = $('<ul class="pagination"></ul>')

    obj.next = {
        li: $('<li class="page-item"></li>'),
        a: $('<a class="page-link">></a>')
    }

    obj.previous = {
        li: $('<li class="page-item"></li>'),
        a: $('<a class="page-link"><</a>')
    }

    obj.previous.a.on('click',function(){
        obj.page = obj.page - 1;
        obj.page = obj.page < 1 ? 1: obj.page;
        obj.callback();
    })

    obj.next.a.on('click',function(){
        obj.page = obj.page + 1;
        obj.callback();
    })

    obj.build = function () {
        return this.nav.append(
            this.ul.append(
                this.previous.li.append(this.previous.a)
            ).append(
                this.next.li.append(this.next.a)
            ));
    }

    obj.getQuery = function(){
        return "?_page=" + this.page + "&_limit=" + this.limit;
    }

    obj.onChanged = function (callback) {
        this.callback = callback;
    }

    obj.reset = function(){
        obj.limit = 10;
        obj.page = 0;
    }

    return obj;
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
        var h = timestamp.split('.')
        categories.push(h[1])
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