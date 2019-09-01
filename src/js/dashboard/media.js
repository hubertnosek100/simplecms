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
            $list.append($('<div class="card"></div>')
                .append($('<div class="card-status bg-gray"></div>'))
                .append(table));
        }
    }

    function _newELement(element) {
        $row = $("<tr></tr>");
        $col = $("<td></td>").text(element);
        $copyCol = $("<td></td>")
        $imgCol = $("<td></td>")

        var url = _makeMediaUrl(element)
        $imgCol.append('<img style="height:40px; width:40px;object-fit:contain;" src= "' + url + '"/>')
        var $copyBtn = $("<button data-url='" + url + "' class='btn btn-sm btn-outline-dark'><i class='fas fa-copy'></i> Copy</button>");
        $copyBtn.on('click', _copyToCliboard)
        $copyCol.append($copyBtn)

        var $rmBtn = $("<button data-name='" + element + "' class='btn btn-sm btn-outline-danger ml-3'><i class='fas fa-trash-alt'></i> Remove</button>");
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