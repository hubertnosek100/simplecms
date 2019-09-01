app.simplelanguage = (function () {
    function _init(url) {
        app.service.get(url + '/lang', _set);
    }

    function _getCurrentLangImage(container, lang) {
        if (Boolean($(container).attr('flag'))) {
            if (lang.code === app.service.getLanguage()) {
                return '<img style="height:24px; width:24px;object-fit:contain; padding:3px;"  src="' + lang.url + '"/>'
            }
        }
    }
    function _set(data) {
        $simplelanguage = $(app.static.simplelanguage);
        $simplelanguage.each(function (idx, el) {
            var select = $('<div class="dropdown"></div>')
            var btn = $(' <button class="btn btn-outline-primary  dropdown-toggle" type="button" id="dropdownLanguagesMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Languages</button>');
            var container = $('<div class="dropdown-menu" aria-labelledby="dropdownLanguagesMenuButton"></div>')
            data.forEach(function (lang) {
                var opt = $('<a data-code="' + lang.code + '" class="dropdown-item"></a>')
                opt.append('<img style="height:40px; width:40px;object-fit:contain;"  src="' + lang.url + '"/>');
                opt.append('<span style="margin-left:10px;">' + lang.placeholder + '</span>');
                opt.on('click', _changeLanguage);
                var current = _getCurrentLangImage(el, lang);
                if(current){
                    btn.prepend(current)
                }
                container.append(opt)
            })
            select.append(btn)
            $(select).append(container)
            $(el).append(select);
        });
    }

    function _changeLanguage(el) {
        var target = $(el.target);
        if (el.target.nodeName !== "A") {
            target = $(target).parent();
        }
        var code = target.attr('data-code');
        app.service.changeLanguage(code);
    }

    return {
        load: _init
    }
}());