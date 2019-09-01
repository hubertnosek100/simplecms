Array.prototype.first = function () {
    return this[0];
};
Array.prototype.last = function () {
    return this[this.length - 1];
};
Array.prototype.next = function (predicate, thisValue) {
    return this[this.findIndex(predicate, thisValue) + 1];
};
Array.prototype.prev = function (predicate, thisValue) {
    return this[this.findIndex(predicate, thisValue) - 1];
};
Array.prototype.any = function () {
    return this.length > 0;
}

Array.prototype.contains = function (val) {
    return this.indexOf(val) !== -1;
}

String.prototype.contains = function (val) {
    return this.indexOf(val) !== -1;
}


Array.prototype.groupBy = function (key) {
    return this.reduce(function (rv, x) {
        (rv[x[key]] = rv[x[key]] || []).push(x);
        return rv;
    }, {});
};

Array.prototype.distinctBy = function (key) {
    let grouped = this.groupBy(key);
    let distinctBy = [];
    for (const prop in grouped) {
        if (grouped.hasOwnProperty(prop) && prop !== "undefined") {
            const element = grouped[prop];
            if (element) {
                distinctBy.push(element.first());
            }
        }
    }
    return distinctBy;
};