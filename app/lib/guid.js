function Guid(p) {
    let base = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
    if (p === 'N') {
        base = 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx';
    }
    var d = new Date().getTime();
    if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
        d += performance.now(); //use high-precision timer if available
    }
    return base.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c === 'x' ? r : ((r & 0x3) | 0x8)).toString(16);
    });
}

module.exports = Guid;