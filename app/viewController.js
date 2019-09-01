var userController = require('./user/userController')
var viewController = function (server, userMiddleware) {
    userController(server, userMiddleware)
    
    server.get('/', (req, res) => {
        userMiddleware(req, res, true)
        res.render('index')
    });

    server.get('/simplecms/', (req, res) => {
        userMiddleware(req, res)
        res.render('index')
    });

    server.get('/login/', (req, res) => {
        userMiddleware(req, res, true)
        res.render('login')
    });

    server.get('/simplecms/components/', (req, res) => {
        userMiddleware(req, res, true)
        res.render('components')
    });

    server.get('/simplecms/database/', (req, res) => {
        userMiddleware(req, res)

        res.render('database')
    });

    server.get('/simplecms/examples/', (req, res) => {
        userMiddleware(req, res)
        res.render('examples')
    });

    server.get('/simplecms/dashboard/', (req, res) => {
        userMiddleware(req, res)
        res.render('dashboard/dashboard')
    });

    server.get('/simplecms/dashboard/exponents/', (req, res) => {
        userMiddleware(req, res)
        res.render('dashboard/exponent')
    });

    server.get('/simplecms/dashboard/newexponent/', (req, res) => {
        userMiddleware(req, res)
        res.render('dashboard/newexponent')
    });

    server.get('/simplecms/dashboard/newtemplate/', (req, res) => {
        userMiddleware(req, res)
        res.render('dashboard/newtemplate')
    });

    server.get('/simplecms/dashboard/templates/', (req, res) => {
        userMiddleware(req, res)
        res.render('dashboard/template')
    });

    server.get('/simplecms/dashboard/media/', (req, res) => {
        userMiddleware(req, res)
        res.render('dashboard/media')
    });

    server.get('/simplecms/dashboard/lang/', (req, res) => {
        userMiddleware(req, res)
        res.render('dashboard/lang')
    });

    server.get('/simplecms/dashboard/newlang/', (req, res) => {
        userMiddleware(req, res)
        res.render('dashboard/newlang')
    });

    server.get('/simplecms/dashboard/monitoring/', (req, res) => {
        userMiddleware(req, res)
        res.render('dashboard/monitoring')
    });

    server.get('/simplecms/dashboard/newmonitoring/', (req, res) => {
        userMiddleware(req, res)
        res.render('dashboard/newmonitoring')
    });

    server.get('/simplecms/users/', (req, res) => {
        userMiddleware(req, res)
        res.render('users/list')
    });
};

module.exports = viewController;