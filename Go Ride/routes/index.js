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
  res.render('login', { title: 'Login', year: new Date().getFullYear(), message: '' });
};

exports.loginpost = function (req, res) {
  var username = req.body.username;
  var password = req.body.password;
  var err;
  var login = require('../modules/login.js');
  login.tryLogin(username, password, function (success, err) {
    if (success) {
      res.cookie('user', username);
      res.redirect('/');
    } else { res.render('login', { title: 'Login', year: new Date().getFullYear(), message: err }); }
  });
};

exports.registerUser = function (req, res) {
  res.render('registerUser', { title: 'Register User', year: new Date().getFullYear(), message: '' });
};

exports.userDetails = function (req, res) {
  res.render('userDetails', { title: '', year: new Date().getFullYear(), message: '' });
};

exports.manageLocations = function (req, res) {
  res.render('manageLocations', { title: '', year: new Date().getFullYear(), message: '' });
};

exports.contacts = function (req, res) {
  res.render('contacts', { title: '', year: new Date().getFullYear(), message: '' });
};
// Needs to be uncommented and updated when back code is done.
/*exports.registerpost = function (req, res) {
    var IDnumber = req.body.IDnumber
    var name = req.body.name;
    var surname = req.bosy.surname;
    var email = req.body.email;
    var username = req.body.username;
    var password = req.body.password;
    var picture = req.body.picture;
    var streetNumber = req.body.streetNumber;
    var streetName = req.body.streetName;
    var suburb = req.body.suburb;
    var province = req.body.province;
    var register = require("../modules/register.js");
    register.tryRegister(IDnumber, name, surname, email, username, password, picture, streetNumber, streetName, suburb, province);
*/
exports.manageEvent = function (req, res) {
  res.render('manageEvent', { title: 'Manage Event', year: new Date().getFullYear(), message: 'Manage Event page' });
};

exports.addEvent = function (req, res) {
  res.render('addEvent', { title: 'Add Event', year: new Date().getFullYear(), message: 'Add Event page' });
};
exports.editEvent = function (req, res) {
  res.render('editEvent', { title: 'Edit Event', year: new Date().getFullYear(), message: 'Edit Event page' });
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

/* exports.addEventpost = function (req, res) {
  var eventName = req.body.eventName;
  var eventCategory = req.body.eventCatagory;
  var streetNumORVenueName = req.body.streetNumORVenueName;
  ver streetName = req.body.streetName;
  var suburb = req.body.suburb;
  var city = req.body.city;
  var province = req.body.province;
  var date = req.body.date;
  var time = req.body.time;
  var register = require("../modules/addEvent.js");
  addEvent.tryAddEvent(eventName, eventCatagory, streetNumORVenueName, streetName, suburb, city, province, date, time, function (success, error) {
    
      });
    };
  */

/* exports.editEventpost = function (req, res) {
var eventName = req.body.eventName;
var eventCategory = req.body.eventCatagory;
var streetNumORVenueName = req.body.streetNumORVenueName;
ver streetName = req.body.streetName;
var suburb = req.body.suburb;
var city = req.body.city;
var province = req.body.province;
var date = req.body.date;
var time = req.body.time;
var register = require("../modules/editEvent.js");
editEvent.tryEditEvent(eventName, eventCatagory, streetNumORVenueName, streetName, suburb, city, province, date, time, function (success, error) {
  
    });
  };
*/

exports.getEvents = function (req, res) {
  var events = require("../modules/getEvent.js");
  var searchTerm = req.query.searchTerm;
  events.trySearch(searchTerm, function (jsonObject) {
    res.json(jsonObject);
  });
};