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