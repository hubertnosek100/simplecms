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