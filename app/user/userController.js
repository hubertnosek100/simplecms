var JsonDB = require('node-json-db');

var userController = function (server, userMiddleware) {
    this.dbString = "db/user"
    server.get('/users/list', (req, res) => {
        userMiddleware(req, res);
        var db = new JsonDB(this.dbString, true, false);
        var users = db.getData("user/users") || [];
        var dtos = users.map((x) => {
            return {
                id: x.id,
                login: x.login
            }
        });
        res.jsonp(dtos);
    });
};

module.exports = userController;