app.dashboard.hourData = function (data) {
    var names = [];
    var columns = [];
    var colors = {};
    var cl = [tabler.colors["orange"],
        tabler.colors["blue"],
        tabler.colors["green"],
        tabler.colors["red"],
        tabler.colors["yellow"],
        tabler.colors["purple"]
    ];

    for (var timestamp in data) {
        if (data.hasOwnProperty(timestamp)) {
            for (var col in data[timestamp]) {
                if (data[timestamp].hasOwnProperty(col)) {
                    if (names.indexOf(col) === -1) {
                        names.push(col);
                        var ar = [];
                        ar.push(col);
                        columns.push(ar)
                        colors[col] = cl[names.length];
                    }
                }
            }
        }
    }

    var categories = [];

    var obj = {};
    for (let j = 0; j < names.length; j++) {
        obj[names[j]] = 0;
    }

    var sorted = {};
    var a = new Date();
    for (let j = 0; j < a.getHours() + 1; j++) {
        var timestamp = (a.getMonth() + 1) + '/' + a.getDate() + '/' + a.getFullYear() + '.' + j;
        if (!data.hasOwnProperty(timestamp)) {
            sorted[timestamp] = obj;
        } else {
            sorted[timestamp] = data[timestamp];
        }
    }
    for (var timestamp in sorted) {
        categories.push(timestamp.slice(9, 11))
        if (sorted.hasOwnProperty(timestamp)) {
            for (let j = 0; j < names.length; j++) {
                var value = 0;
                if (sorted[timestamp].hasOwnProperty(names[j])) {
                    value = sorted[timestamp][names[j]]
                }
                columns[j].push(value)
            }
        }
    }
    return {
        categories: categories,
        colors: colors,
        data: columns
    }
}