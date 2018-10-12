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
        $actionCol = $("<td></td>")
        $imgCol = $("<td></td>")

        var url = _makeMediaUrl(element)
        $imgCol.append('<img style="height:40px; width:40px" src= "' + url + '"/>')
        var $copyBtn = $("<button data-url='" + url + "' class='btn btn-outline-dark'><i class='fas fa-copy'></i></button>");
        $copyBtn.on('click', _copyToCliboard)
        $actionCol.append($copyBtn)

        $row.append($imgCol);
        $row.append($col);
        $row.append($actionCol);
        return $row;
    }

    function _makeMediaUrl(param) {
        return app.url + '/uploaded/' + param;
    }

    function _copyToCliboard(e) {
        var text = $(e.target).attr('data-url')
        var $temp = $("<input>");
        $("body").append($temp);
        $temp.val(text).select();
        document.execCommand("copy");
        $temp.remove();
    }


    return {
        init: _init
    }
}());

app.media = media;