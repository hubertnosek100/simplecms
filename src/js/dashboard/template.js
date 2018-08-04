app.template = (function () {
    function _init() {
        $(document).ready(function () {
            _load();
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
        $editbtn = $("<button db-id='" + element.id + "' class='btn btn-primary ml-3' style='width: 40px;'><i class='far fa-edit'></i></i></button>");

        $rmbtn.on("click", _remove);

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
        var id = $(params.target).attr("db-id");
        app.service.delete("/" + app.static.template + "/" + id);
        _reload();
    }


    function _reload() {
        $('.template-list').empty();
        _load();
    }


    return {
        init: _init
    }
}());