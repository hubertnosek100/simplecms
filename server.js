const jsonServer = require('json-server')
const server = jsonServer.create()
const router = jsonServer.router('db.json')
const middlewares = jsonServer.defaults()
var passwordhasher = require('password-hasher');
var jwt = require('jsonwebtoken');

server.use(jsonServer.bodyParser)

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

server.post('/login', (req, res) => {
  var a = 1;
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
            apikey: auth.apikey
          }
        }, auth.privatekey, {
          expiresIn: '1h'
        });

        res.jsonp({
          message: "sucess",
          token: token
        })
      }
    }
  }
  res.jsonp({
    message: "failure"
  })
})

server.use(middlewares)
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
  return true;
  if (req.originalUrl === '/login') {
    return true;
  }

  if (isAuthorizedByToken(req.headers.token)) {
    return true
  }

  return auth.apikey === req.headers.apikey && req.method === "GET";
}

function isAuthorizedByToken(token) {
  if(!token){
    return false;
  }
  var decoded = jwt.verify(token, auth.privatekey);
  var date = new Date();
  var now = date.getTime() / 1000;
  var expired = now > decoded.exp;
  return (decoded.data.apikey === auth.apikey) && !expired;
}