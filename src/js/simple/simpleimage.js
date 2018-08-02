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