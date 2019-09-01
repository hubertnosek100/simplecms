var express = require('express');
var app = express();
var port = 8020;
app.use(express.static(__dirname));
app.listen(port);
console.log("App listening on port " + port)