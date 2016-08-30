﻿/*
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

exports.loginpost = function (req, res) {
  var username = req.body.username;
  var password = req.body.password;
  var err;
  var login = require('../modules/login.js');
  login.tryLogin(username, password, function (success, err) {
    if (success) {
      res.cookie('user', username);
      res.render('index', { title: 'Express', year: new Date().getFullYear() });
    } else { res.render('login', { title: 'Login', year: new Date().getFullYear(), message: err }); }
  });
};

exports.registerUser = function (req, res) {
  res.render('registerUser', { title: 'Register User', year: new Date().getFullYear(), message: 'Register User page' });
};

exports.userDetails = function (req, res) {
  res.render('user_details', { title: '', year: new Date().getFullYear(), message: '' });
};

exports.manageEvent = function (req, res) {
    res.render('manageEvent', { title: 'Manage Event', year: new Date().getFullYear(), message: 'Manage Event page' });
};

exports.addEvent = function (req, res) {
    res.render('addEvent', { title: 'Add Event', year: new Date().getFullYear(), message: 'Add Event page' });
};


exports.registerpost = function (req, res) {
  var IDnumber = req.body.IDnumber;
  var name = req.body.name;
  var surname = req.body.surname;
  var username = req.body.username;
  var password = req.body.password;
  var picture = req.file;
  console.log(picture);
  var streetNumber = req.body.streetNum[0];
  var streetName = req.body.streetNum[1];
  var suburb = req.body.suburb;
  var province = req.body.province;
  var town = req.body.town;
  var register = require("../modules/register.js");
  register.tryRegister(IDnumber, name, surname, username, password, picture, streetNumber, streetName, suburb, town, province, function (success, error) {
    if (success) {
      res.redirect('/login');
    } else {
      res.render('registerUser', { title: 'Register User', year: new Date().getFullYear(), message: error });
    }
  });
};
