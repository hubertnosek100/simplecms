var JsonDB = require('node-json-db');
var passwordhasher = require('password-hasher');
var guid = require('../lib/guid');

var userManager = function (dbString) {
    this.dbString = dbString;
    this.create = create;
    this.login = login;
    this.addClaim = addClaim;
    this.hasClaim = hasClaim;
    return this;
}

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

var addRole = function () {
    // todo in future
}

var hasClaim = function (login, claimId) {
    var db = new JsonDB(this.dbString, true, false);
    var users = db.getData("users/users") || [];
    var user = users.find(x => x.login === login);
    if (user) {
        var claim = (user.claims || []).find(x => x.id === claimId);
        return {
            succeded: claim !== undefined,
            error: claim !== undefined ? undefined : 'User does not have that claim.'
        }
    }
    return {
        succeded: false,
        error: 'User with that email does not exist.'
    }
}

var addClaim = function (login, claimId) {
    var db = new JsonDB(this.dbString, true, false);
    var users = db.getData("users/users") || [];
    var claims = db.getData("users/claims") || [];
    var user = users.find(x => x.login === login);
    var claim = claims.find(x => x.id === claimId);
    if (user) {
        if (claim) {
            user.claims = user.claims || [];
            user.claims.push(claim);
            db.push("users/users", users)
            return {
                succeded: true
            }
        }
        else {
            return {
                succeded: false,
                error: 'Claim doest not exist.'
            }
        }
    }
    else {
        return {
            succeded: false,
            error: 'User with that email does not exist.'
        }
    }
}

var login = function (login, password) {
    var db = new JsonDB(this.dbString, true, false);
    var users = db.getData("users/users") || [];
    var user = users.find(x => x.login === login);
    if (user) {
        var hash = passwordhasher.createHash('ssha512', password, Buffer.from('83d88386463f0625', 'hex'));
        var rfcHash = passwordhasher.formatRFC2307(hash)
        if (rfcHash == user.password) {
            return {
                succeded: true
            }
        }
    }
    else {
        return {
            succeded: false,
            error: 'User with that email does not exist.'
        }
    }
}

var create = function (data) {
    var login = data.login;
    var password = data.password;
    var confirmPassword = data.confirm
    if (validateEmail(login)) {
        if (confirmPassword === password) {
            var db = new JsonDB(this.dbString, true, false);
            var users = db.getData("users/users") || [];
            var user = users.find(x => x.login === login);
            if (user) {
                return {
                    succeded: false,
                    error: 'User with that email already exist.'
                }
            }
            var hash = passwordhasher.createHash('ssha512', password, Buffer.from('83d88386463f0625', 'hex'));
            var rfcHash = passwordhasher.formatRFC2307(hash)

            users.push({
                id: guid(),
                login: login,
                password: rfcHash
            });
            db.push("users/users", users);
            return {
                succeded: true
            }
        }
        else {
            return {
                succeded: false,
                error: 'Passwords are different.'
            }
        }
    }
    return {
        succeded: false,
        error: 'Login is not valid email.'
    };
}


userManager.login = login;
userManager.create = create;
userManager.addClaim = addClaim;
userManager.hasClaim = hasClaim;

module.exports = userManager;