app.dashboard = (function () {

    function _init() {
        $(document).ready(function () {
            _load();

            $('#apikeygeneratebtn').on('click', _generate);
            app.dashboard.chart();
        });
    }

    function _load() {
        app.service.get("/apikey", _set);
    }

    function _set(auth) {
        if (auth.apikey !== "default") {
            $('#apikeytext').val(auth.apikey)
        }
    }

    function _generate(params) {
        var api = _guid();
        $('#apikeytext').val(api);
        app.service.post('/apikey/', {
            apikey: api
        });
    }

    function _guid() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        var s = '';
        for (let i = 0; i < 10; i++) {
            s += s4();
        }
        return s;
    }



    return {
        init: _init
    }
}());

app.dashboard.chart = function () {

    $('input[type=radio][name=when]').change(function () {
        console.log(this.value);
        if (this.value === "daily") {
            drawDaily();
        } else if (this.value === "monthly") {
            drawMonthly();
        } else if (this.value === "yearly") {
            drawYearly();
        }
    });

    var drawYearly = function () {
        app.service.get("/requester?when=yearly", function (data) {
            var parsed = app.dashboard.yearData(data);
            draw(parsed);
        });
    }

    var drawMonthly = function () {
        app.service.get("/requester?when=monthly", function (data) {
            var parsed = app.dashboard.monthData(data);
            draw(parsed);
        });
    }

    var drawDaily = function () {
        app.service.get("/requester?when=daily", function (data) {
            var parsed = app.dashboard.hourData(data);
            draw(parsed);
        });
    }

    drawDaily();
    var draw = function (parsed) {
        var chart = c3.generate({
            bindto: '#chart-employment', // id of chart wrapper
            data: {
                columns: parsed.data,
                type: 'line', // default type of chart
                colors: parsed.colors
            },
            axis: {
                x: {
                    type: 'category',
                    // name of each category
                    categories: parsed.categories
                },
            },
            legend: {
                show: true, //hide legend
            },
            padding: {
                bottom: 0,
                top: 0
            },
        });
    }
};