var preview = (function () {

    function _build(req) {
        var preview = {};
        preview.request = req;
        preview.toHtml = _toHtml;
        preview.withTime = _withTime;

        return preview;
    }

    function _withTime(time) {
        this.time = time + " ms";
    }

    function _toHtml() {
        if (this.request.status === 200) {

            var type = this.request.getResponseHeader('content-type');
            return _addElement(this.request.status, "Status")
                .append(_addElement(this.request.responseURL, "Url"))
                .append(_addElement(type, "Typ"))
                .append(_addElement(this.time, "Czas"))
                .append(_addElement(this.request.response, "Odpowiedź"))
        }
        else {
            return _addElement(this.request.status, "Status")
                .append(_addElement(this.request.responseURL, "Url"))
                .append(_addElement(this.time, "Czas"))
                .append(_addElement(this.request.statusText, "Błąd"))

        }
    }

    function _addElement(text, titleText) {
        var title = $('<strong></strong>').text(`${titleText}: `);
        var content = $('<span></span>').text(text);
        return $('<p class="mb-0"></p>').append(title).append(content);
    }

    return {
        build: _build
    }
}());

app.monitoring = app.module(app.monitoring);
app.monitoring.preview = preview;