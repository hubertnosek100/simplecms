app.dashboard.yearData = function (data) {
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

    var yearly = {};

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
                    var year = timestamp.split('/')[0];
                    if (!yearly[year]) {
                        yearly[year] = {}
                    }
                    if (yearly[year][col]) {
                        yearly[year][col] = data[timestamp][col] + yearly[year][col];
                    } else {
                        yearly[year][col] = data[timestamp][col];
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
    for (let j = 1; j < a.getMonth() + 2; j++) {
        if (!yearly.hasOwnProperty(j)) {
            sorted[j] = obj;
        } else {
            sorted[j] = yearly[j];
        }
    }


    for (var timestamp in sorted) {
        categories.push(timestamp)
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