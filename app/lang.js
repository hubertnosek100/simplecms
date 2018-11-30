var JsonDB = require('node-json-db');


var lang = function (app, userMiddleware) {
    app.get('/lang', (req, res) => {
        var json = lang.load()
        res.json(json.lang)
    });
    app.post('/newlang', (req, res) => {
        var newLang = {
            code: req.body.code,
            placeholder: req.body.placeholder,
            url: req.body.url
        };

        var json = lang.load();
        json.lang.push(newLang);
        lang.save(json);

        res.redirect("/simplecms/dashboard/lang/")
    });
    app.post('/removelang', (req, res) => {

        var code = req.body.code;
        var json = lang.load();

        var toRm = json.lang.filter(x => x.code === code);
        toRm.forEach(x => {
            json.lang.splice(json.lang.indexOf(x), 1);
        })

        lang.save(json);

        res.redirect("/simplecms/dashboard/lang/")
    })
};

lang.load = function load() {
    var db = new JsonDB("db/lang", true, false);
    return db.getData("lang");
}

lang.save = function save(lang) {
    var db = new JsonDB("db/lang", true, false);
    db.push("lang", lang);
}


module.exports = lang;