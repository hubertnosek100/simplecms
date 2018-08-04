const jsonServer = require('json-server')
const router = jsonServer.router('db.json')
const middlewares = jsonServer.defaults()
var passwordhasher = require('password-hasher');
var jwt = require('jsonwebtoken');
var cookieParser = require('cookie-parser')
var controller = require('./app/controller');
var expressLayouts = require('express-ejs-layouts');
var express = require('express');


var server = express();
server.set('view engine', 'ejs');

server.use(expressLayouts);
server.use(jsonServer.bodyParser)
server.use(cookieParser())

controller(server, userMiddleware);


var auth;

fs = require('fs');
fs.readFile('apikey.json', 'utf8', function (err, data) {
  if (err) {
    return console.log(err);
  }
  console.log(data);
  auth = JSON.parse(data);
});


server.get('/apikey', (req, res) => {
  res.jsonp(auth)
})

server.post('/apikey', (req, res) => {
  var apikey = req.body.apikey;
  auth.apikey = apikey;
  fs.writeFile("apikey.json", JSON.stringify(auth), function (err) {
    if (err) {
      return console.log(err);
    }
    console.log("The file was saved!");
  });
})

server.get('/logout', (req, res) => {
  res.cookie('token', "")
  userMiddleware(req, res)
  // res.render('login')
  res.redirect('/login');
});



server.post('/login', (req, res) => {
  var name = req.body.login;
  var pwd = req.body.password;

  if (name && pwd) {
    if (name === auth.username) {
      var hash = passwordhasher.createHash('ssha512', pwd, new Buffer('83d88386463f0625', 'hex'));
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

        res.cookie('token', token)
        userMiddleware(req, res)
        res.redirect('/');

        // res.jsonp({
        //   message: "sucess",
        //   token: token
        // })
      }
    }
  }
  // res.jsonp({
  //   message: "failure"
  // })
  res.render('login')
})

server.use(middlewares)

server.use(function (req, res, next) {
  res.locals.user = "Hubert"
  next()
})

server.use((req, res, next) => {
  if (isAuthorized(req)) { // add your authorization logic here
    next() // continue to JSON Server router
  } else {
    res.sendStatus(401)
  }
})
server.use(router)
server.listen(3000, () => {
  console.log('JSON Server is running')
})


function isAuthorized(req) {
  if (req.originalUrl === '/login') {
    return true;
  }

  if (isAuthorizedByToken(req.headers.token)) {
    return true
  }

  if (isAuthorizedByToken(req.cookies["token"])) {
    return true
  }

  return auth.apikey === req.headers.apikey && req.method === "GET";
}

function userMiddleware(req, res) {
  if (isAuthenticated(req)) {
    res.locals.isAuthenticated = true;

  } else {
    res.locals.isAuthenticated = false;
  }
}

function isAuthenticated(req) {
  return isAuthorizedByToken(req.cookies["token"]);
}

function isAuthorizedByToken(token) {
  if (!token) {
    return false;
  }
  var decoded = undefined
  try {
    decoded = jwt.verify(token, auth.privatekey);
  } catch(err){
    return false;
  }
  var date = new Date();
  var now = date.getTime() / 1000;
  var expired = now > decoded.exp;
  return (decoded.data.publickey === auth.publickey) && !expired;
}