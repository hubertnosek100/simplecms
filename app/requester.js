var JsonDB = require('node-json-db');

var requester = (function () {

    var _db;

    function _init(server) {
        _db = new JsonDB("db/dc", true, false);

        server.get('/requester', (req, res) => {
            var counter = _db.getData('counter');
            res.json(counter.counter);
        });
    }

    function _save(req) {
        var obj = _db.getData('counter');

        var timestamp = _getTimeStamp();
        var counter = obj.counter[timestamp];
        if (!counter) {
            obj.counter[timestamp] = {};
        }

        var key = _transformKey(req);


        if (counter[key]) {
            counter[key] = counter[key] + 1;
        } else {
            counter[key] = 1;
        }


        obj.counter[timestamp] = counter;
        _db.push("counter", obj);
    }

    function _transformKey(req) {
        var key = req.url.replace('/', '')
        key = key.replace("simplecms/dashboard/", '');
        key = key.replace("simplecms/database/", '');
        return key;
    }

    function _getTimeStamp() {
        var a = new Date();
        return a.toLocaleDateString() + '.' + a.getHours();
    }

    return {
        save: _save,
        init: _init
    }
}());

module.exports = requester;