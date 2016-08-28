
/*
 * GET home page.
 */

exports.index = function (req, res) {
    res.render('index', { title: 'Express', year: new Date().getFullYear() });
};

exports.about = function (req, res) {
    res.render('about', { title: 'About', year: new Date().getFullYear(), message: 'Your application description page' });
};

exports.contact = function (req, res) {
    res.render('contact', { title: 'Contact', year: new Date().getFullYear(), message: 'Your contact page' });
};

exports.login = function (req, res) {
    res.render('login', { title: 'Login', year: new Date().getFullYear(), message: 'Your login page' });
};

exports.registerUser = function (req, res) {
    res.render('registerUser', { title: 'Register User', year: new Date().getFullYear(), message: 'Register User page' });
};

exports.loginpost = function (req, res) {
    var username = req.body.username;
    var password = req.body.password;
    var err;
    var login = require("../modules/login.js");
    login.tryLogin(username, password, function (success, err) {
        if (success) {
            res.cookie(user, username);
            res.render('index', { title: 'Express', year: new Date().getFullYear() });
        }
        else { res.render('login', { title: 'Login', year: new Date().getFullYear(), message: err }); }
    });
};



