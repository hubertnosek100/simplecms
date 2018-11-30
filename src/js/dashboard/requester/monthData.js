app.dashboard.monthData = function (data) {
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

    var monthly = {};

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

                    var month = timestamp.split('/')[1];
                    if (!monthly[month]) {
                        monthly[month] = {}
                    }
                    if (monthly[month][col]) {
                        monthly[month][col] = data[timestamp][col] + monthly[month][col];
                    } else {
                        monthly[month][col] = data[timestamp][col];
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
    for (let j = 0; j < a.getDate() + 1; j++) {
        if (!monthly.hasOwnProperty(j)) {
            sorted[j] = obj;
        } else {
            sorted[j] = monthly[j];
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