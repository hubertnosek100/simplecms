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