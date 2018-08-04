app.exponents = (function () {
    function _init() {
        $(document).ready(function () {
            _load();
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
        $editbtn = $("<button db-id='" + element.id + "' class='btn btn-primary ml-3' style='width: 40px;'><i class='far fa-edit'></i></i></button>");

        $rmbtn.on("click", _remove);
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
        var id = $(params.target).attr("db-id");
        console.log(id)
        app.service.delete("/" + app.static.exponent + "/" + id);
        _reload();
    }

    function _reload() {
        $('.exponents-list').empty();
        _load();
    }


    return {
        init: _init
    }
}());