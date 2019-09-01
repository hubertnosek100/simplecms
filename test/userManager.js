var assert = require('assert');
var userManager = require('../app/user/userManager')
var JsonDB = require('node-json-db');

describe('User Manager', function () {
  it('create user', function () {

    var db = new JsonDB('test/test', true, false);
    db.push("users/users", [], true);

    var data = {
      login: "a@wp.pl",
      password: "abc",
      confirm: "abc"
    }
    var result = userManager('test/test').create(data);
    assert.equal(result.succeded, true);
  });

  it('add claim', function () {
    var db = new JsonDB('test/test', true, false);
    db.push("users/users", [{ login: "a@wp.pl" }], true);

    var result = userManager('test/test').addClaim("a@wp.pl", 'uihafoduahdf');
    assert.equal(result.succeded, true);
  });
});
