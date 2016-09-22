/*
 * GET home page.
 */

var cookie = require('cookie');

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

exports.userDelete = function (req, res) {
  res.render('userDelete', { title: '', year: new Date().getFullYear(), message: '' });
};

exports.manageEvent = function (req, res) {
  res.render('manageEvent', { title: 'Manage Event', year: new Date().getFullYear(), message: '' });
};

exports.addEvent = function (req, res) {
  res.render('addEvent', { title: 'Add Event', year: new Date().getFullYear(), message: 'e' });
};
exports.editEvent = function (req, res) {
  res.render('editEvent', { title: 'Edit Event', year: new Date().getFullYear(), message: '', event: req.query.eventName });
};
exports.viewProfile = function (req, res) {
  res.render('viewProfile', { title: 'View Profile', year: new Date().getFullYear(), message: '',UserID: req.query.user});
};
exports.viewListOfRideshareGroups = function (req, res) {
  res.render('viewListOfRideshareGroups', { title: 'View Participating Rideshare Groups', year: new Date().getFullYear(), message: '' });
};
exports.viewRideshareGroup = function (req, res) {
  res.render('viewRideshareGroup', { title: 'View Rideshare Groups', year: new Date().getFullYear(), message: '' });
};
exports.addRideshareGroup = function (req, res) {
  res.render('addRideshareGroup', { title: 'Add Rideshare Groups', year: new Date().getFullYear(), message: '' });
};



exports.registerpost = function (req, res) {
  var IDnumber = req.body.IDnumber;
  var name = req.body.name;
  var surname = req.body.surname;
  var username = req.body.username;
  var password = req.body.password;
  var picture = req.file;
  var streetNumber = req.body.streetNum;
  var streetName = req.body.streetName;
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

exports.addEventpost = function (req, res) {
  console.log(req.body);
  var eventName = req.body.eventName;
  var eventCategory = req.body.eventCategory;
  var streetNumORVenueName = req.body.streetNumORVenueName;
  var streetName = req.body.streetName;
  var suburb = req.body.suburb;
  var city = req.body.city;
  var province = req.body.province;
  var date = req.body.date;
  var time = req.body.time;
  //merge date & time into "2016-09-13 00:00:00" format
  // var dateformat = date.substring(6, 9) + "-" + date.substring(3, 4) + "-" + date.substring(0, 1);
  var datetime = date + "T" + time + ":00";
  var username = cookie.parse(req.headers.cookie).user;
  var events = require("../modules/addEvent.js");
  events.tryAddEvent(username, eventName, eventCategory, streetNumORVenueName, streetName, suburb, city, province, datetime, function (success, error) {

    if (success) {
      res.redirect('/manageEvent');
    } else {
      res.render('addEvent', { title: 'Add Event', year: new Date().getFullYear(), message: error });
    }
  });

};


exports.editEventpost = function (req, res) {
  var eventID = req.body.eventID;
  var eventName = req.body.eventName;
  var eventCategory = req.body.eventCategory;
  var streetNumORVenueName = req.body.streetNumORVenueName;
  var streetName = req.body.streetName;
  var suburb = req.body.suburb;
  var city = req.body.city;
  var province = req.body.province;
  var date = req.body.date;
  var time = req.body.time;
  //merge date & time into "2016-09-13 00:00:00" format
  var dateformat = date.substring(6, 9) + "-" + date.substring(3, 4) + "-" + date.substring(0, 1);
  var datetime = dateformat + time + "00";
  var events = require("../modules/editEvent.js");
  events.tryEditEvent(eventID, eventName, eventCategory, streetNumORVenueName, streetName, suburb, city, province, datetime, function (success, error) {
    if (success) {
      res.redirect('/manageEvent');
    } else {
      res.render('editEvent', { title: 'Edit Event', year: new Date().getFullYear(), message: error });
    }
  });

};

exports.deleteEvent = function (req, res) {
  var events = require("../modules/deleteEvent.js");
  var eventID = req.body.eventID;
  events.tryDeleteEvent(eventID, function (success, error) {

  });
};

exports.addRideshare = function (req, res){
  var rideshare = require("../modules/addRideshare.js");
};


exports.searchEvents = function (req, res) {
  var events = require("../modules/searchEvents.js");
  var searchTerm = req.body.searchTerm;
  events.trySearch(searchTerm, function (jsonObject) {
    res.json(jsonObject);
  });
};

exports.getCategories = function (req, res) {
  var categories = require("../modules/getCategories.js");
  categories.tryGetCategories(function (jsonObject) {
    res.json(jsonObject);
  });
};

exports.getEvent = function (req, res) {
  var events = require("../modules/getEvent.js");
  var eventName = req.body.eventName;
  events.tryGetEvent(eventName, function (jsonObject) {
    res.json(jsonObject);
  });
};

exports.getBlockedUsers = function (req, res) {
  var users = require("../modules/blockedUsers.js");
  var username = cookie.parse(req.headers.cookie).user;
  users.tryBlockedUsers(username, function (jsonObject) {
    res.json(jsonObject);
  });
};

exports.getLocations = function (req, res) {
  var locations = require("../modules/getLocations.js");
  var username = cookie.parse(req.headers.cookie).user;
  locations.tryGetLocations(username, function (jsonObject) {
    res.json(jsonObject);
  });
};

exports.getProfile = function (req, res) {
  var user = req.body.userID;
  var profile = require("../modules/getProfile.js");
  profile.tryGetProfile(user, function (jsonObject) {
    res.json(jsonObject);
  });
};
