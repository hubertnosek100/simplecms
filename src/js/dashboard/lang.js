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
        var $rmBtn = $("<button data-name='" + element.code + "' class='btn btn-sm btn-outline-danger ml-3'><i class='fas fa-trash-alt'></i> Remove</button>");
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