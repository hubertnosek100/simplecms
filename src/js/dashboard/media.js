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