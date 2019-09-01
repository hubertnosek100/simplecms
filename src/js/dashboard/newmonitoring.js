
var newmonitoring = (function () {

    function _init() {
        $('#healtcheck-btn').on('click', _tryCheck)
    }

    function _tryCheck(e) {
        e.preventDefault();
        $(e.target).addClass('btn-loading');
        var model = app.formToJSON($('#newMonitoringForm'))

        var start_time = new Date().getTime();
        var req = new XMLHttpRequest();
        req.open('GET', model.url, true);
        req.setRequestHeader('Access-Control-Allow-Origin', '*')
        req.onreadystatechange = (aEvt) => { _onResponse(aEvt, req, start_time, e) };
        req.onerror = _onResponse;
        req.send(null);
    }

    function _onResponse(aEvt, req, start_time, e) {
        if (req && req.readyState == 4) {

            $('#callback').parent().removeClass('d-none')
            $('#callback').parent().addClass('d-flex')

            var request_time = new Date().getTime() - start_time;
            var preview = app.monitoring.preview.build(req);
            preview.withTime(request_time);
            $('#callback').html(preview.toHtml())
        }

        $(e.target).removeClass('btn-loading');
    }

    return {
        init: _init
    }
}());

app.monitoring = app.module(app.monitoring);
app.monitoring.new = newmonitoring;