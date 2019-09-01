const jsonServer = require('json-server')
const router = jsonServer.router('db/db.json')
const middlewares = jsonServer.defaults()
var cookieParser = require('cookie-parser')

var expressLayouts = require('express-ejs-layouts');
var express = require('express');

var controller = require('./app/viewController');
var requester = require('./app/requester');
var uploader = require('./app/uploader');
var authorizer = require('./app/authorizer');
var lang = require('./app/lang');

var server = express();
server.set('view engine', 'ejs');

server.use(expressLayouts);
server.use(jsonServer.bodyParser)
server.use(cookieParser())

controller(server, authorizer.userMiddleware);
uploader(server, authorizer.userMiddleware);
lang(server, authorizer.userMiddleware);
authorizer(server);

requester.init(server);

server.use(middlewares)

server.use((req, res, next) => {
  requester.save(req);
  if (authorizer.isAuthorized(req)) { // add your authorization logic here
    next() // continue to JSON Server router
  } else {
    res.sendStatus(401)
  }
})
server.use(router)

var server_port = process.env.OPENSHIFT_NODEJS_PORT || 3000
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0'


server.listen(server_port, server_ip_address, function () {
  console.log( "Listening on " + server_ip_address + ", port " + server_port )
});