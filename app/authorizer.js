var passwordhasher = require('password-hasher');
var jwt = require('jsonwebtoken');

var auth;

fs = require('fs');
fs.readFile('db/apikey.json', 'utf8', function (err, data) {
    if (err) {
        return console.log(err);
    }
    console.log(data);
    auth = JSON.parse(data);
});

var authorizer = function (server) {
    server.get('/apikey', (req, res) => {
        res.jsonp(auth)
    })

    server.post('/apikey', (req, res) => {
        var apikey = req.body.apikey;
        auth.apikey = apikey;
        fs.writeFile("db/apikey.json", JSON.stringify(auth), function (err) {
            if (err) {
                return console.log(err);
            }
            console.log("The file was saved!");
        });
    })


    server.post('/api/check', (req, res) => {
        if (isAuthorized(req)) {
            res.jsonp({
                message: "success",
                succes: true
            })
        }
        res.jsonp({
            message: "failure",
            succes: false
        })
    });

    server.post('/api/login', (req, res) => {
        var name = req.body.login;
        var pwd = req.body.password;
        var result = login(name, pwd)

        if (result.success) {
            res.jsonp({
                message: "success",
                token: result.token
            })
        }
        else {
            res.jsonp({
                message: "failure"
            })
        }
    });

    server.post('/login', (req, res) => {
        var name = req.body.login;
        var pwd = req.body.password;
        var result = login(name, pwd)

        if (result.success) {
            res.cookie('simplecms_token', result.token)
            userMiddleware(req, res)
            res.redirect('/simplecms/dashboard/');
        }
        res.render('login')
    })



    server.get('/logout', (req, res) => {
        res.cookie('simplecms_token', "")
        userMiddleware(req, res)
        res.redirect('/login');
    });
};


var isAuthorized = function (req) {
    if (req.originalUrl === '/login') {
        return true;
    }

    if (isAuthorizedByToken(req.headers.token)) {
        return true
    }

    if (isAuthorizedByToken(req.cookies["simplecms_token"])) {
        return true
    }

    return auth.apikey === req.headers.apikey && req.method === "GET";
}
authorizer.isAuthorized = isAuthorized;

var userMiddleware = function (req, res, noRedirection) {
    if (isAuthenticated(req)) {
        res.locals.isAuthenticated = true;

    } else {
        res.locals.isAuthenticated = false;
        if(!noRedirection){
            res.render('login')
        }
    }
}

authorizer.userMiddleware = userMiddleware

function isAuthenticated(req) {
    return isAuthorizedByToken(req.cookies["simplecms_token"]);
}

function isAuthorizedByToken(token) {
    if (!token) {
        return false;
    }
    var decoded = undefined
    try {
        decoded = jwt.verify(token, auth.privatekey);
    } catch (err) {
        return false;
    }
    var date = new Date();
    var now = date.getTime() / 1000;
    var expired = now > decoded.exp;
    return (decoded.data.publickey === auth.publickey) && !expired;
}


function login(name, pwd) {
    if (name && pwd) {
        if (name === auth.username) {
            var hash = passwordhasher.createHash('ssha512', pwd, Buffer.from('83d88386463f0625', 'hex'));
            var rfcHash = passwordhasher.formatRFC2307(hash)
            if (rfcHash == auth.password) {

                var token = jwt.sign({
                    data: {
                        login: auth.username,
                        publickey: auth.publickey
                    }
                }, auth.privatekey, {
                        expiresIn: '1h'
                    });
                return {
                    success: true,
                    token: token
                }
            }
        }
    }
    return {
        success: false,
    }
}

module.exports = authorizer;