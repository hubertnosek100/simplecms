var JsonDB = require('node-json-db');

var requester = (function () {

    var _db;

    function _init(server) {
        _db = new JsonDB("db/requester", true, false);

        server.get('/requester', (req, res) => {
            var counter = _db.getData('counter');
            res.json(counter.counter);
        });
    }

    function _save(req) {
        var isEmpty = req.url.indexOf('undefined')
        if (isEmpty === -1) {

            var obj = _db.getData('counter');

            var timestamp = _getTimeStamp();
            var counter = obj.counter[timestamp];
            if (!counter) {
                obj.counter[timestamp] = {};
            }

            var key = _transformKey(req);
            if(key === -1){
                return;
            }

            if (counter[key]) {
                counter[key] = counter[key] + 1;
            } else {
                counter[key] = 1;
            }


            obj.counter[timestamp] = counter;
            _db.push("counter", obj);
        }
    }


    function _transformKey(req) {
        let compontents = ["simpletext", "simplevideo", "simpleimage", "login", "uploaded", "template", "exponent", "simplecontainer"]
        var key = req.url.replace('/', '')
        key = key.replace("simplecms/dashboard/", '');
        key = key.replace("simplecms/database/", '');
        
        for (let i = 0; i < compontents.length; i++) {
            const comp = compontents[i];
            if(key.indexOf(comp) !== -1){
                return comp;
            }
        }

        return -1;
    }



    function _getTimeStamp() {
        var date = new Date();
        var month = date.getMonth() + 1
        var day = date.getDate() 
        var year = date.getFullYear()
        var hours = date.getHours()
        return month + '/' + day + '/' + year + '.' + hours;
    }

    return {
        save: _save,
        init: _init
    }
}());

module.exports = requester;