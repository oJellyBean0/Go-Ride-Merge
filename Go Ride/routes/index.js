/*
 * GET home page.
 */

var cookie = require('cookie');

var admin = function (req) {
  return (cookie.parse(req.headers.cookie).isAdministrator === true) ? true : false;
};

exports.index = function (req, res) {
  if (!req.headers.cookie || !cookie.parse(req.headers.cookie) || !cookie.parse(req.headers.cookie).user) {
    res.redirect('/login');
  } else res.render('index', { title: 'Home', year: new Date().getFullYear(), admin: admin(req) });
};

exports.about = function (req, res) {
  res.render('about', { title: 'About', year: new Date().getFullYear(), message: 'Your application description page' });
};

exports.contact = function (req, res) {
  res.render('contact', { title: 'Contact', year: new Date().getFullYear(), message: 'Your contact page' });
};

exports.login = function (req, res) {
  res.render('login', { title: 'Login', year: new Date().getFullYear(), message: '', login: true });
};

exports.loginpost = function (req, res) {
  var username = req.body.username;
  var password = req.body.password;
  var login = require('../modules/login.js');
  login.tryLogin(username, password, function (success, err) {
    if (success) {
      res.cookie('user', username);
      if (err === true) res.cookie('isAdministrator', true);
      else res.cookie('isAdministrator', false);
      res.redirect('/');
    } else { res.render('login', { title: 'Login', year: new Date().getFullYear(), message: err, login: true }); }
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
  res.render('viewProfile', { title: 'View Profile', year: new Date().getFullYear(), message: '', UserID: req.query.user });
};
exports.viewListOfRideshareGroups = function (req, res) {
  res.render('viewListOfRideshareGroups', { title: 'View Participating Rideshare Groups', year: new Date().getFullYear(), message: '' });
};
exports.viewRideshareGroup = function (req, res) {
  res.render('viewRideshareGroup', { title: 'View Rideshare Groups', year: new Date().getFullYear(), message: '', UserID: req.query.user });
};
exports.addRideshareGroup = function (req, res) {
  res.render('addRideshareGroup', { title: 'Add Rideshare Groups', year: new Date().getFullYear(), message: '' });
};
exports.processRideshareRequest = function (req, res) {
  res.render('processRideshareRequest', { title: 'Process Rideshare Request', year: new Date().getFullYear(), message: '' });
};

exports.viewCalendar = function (req, res) {
  res.render('viewCalendar', { title: 'View Calendar', year: new Date().getFullYear(), message: '' });
};

exports.pendingJoinQuery = function (req, res) {
  res.render('pendingJoinQuery', { title: 'Pending Join Query', year: new Date().getFullYear(), message: '' });
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
  var town = req.body.town;
  var nickname = req.body.Nickname;
  var cellphone = req.body.cellphone;
  var driver = req.body.driver;
  var registration = req.body.registrationNum;
  var register = require("../modules/register.js");
  register.tryRegister(IDnumber, name, surname, username, password, picture, streetNumber, streetName, town, nickname, cellphone, driver, registration, function (success, error) {
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
  var city = req.body.city;
  var date = req.body.date;
  var time = req.body.time;
  //merge date & time into "2016-09-13 00:00:00" format
  // var dateformat = date.substring(6, 9) + "-" + date.substring(3, 4) + "-" + date.substring(0, 1);
  var datetime = date + "T" + time + ":00";
  var username = cookie.parse(req.headers.cookie).user;
  var events = require("../modules/addEvent.js");
  events.tryAddEvent(username, eventName, eventCategory, streetNumORVenueName, streetName, city, datetime, function (success, error) {
    if (success) {
      res.redirect('/manageEvent');
    } else {
      res.render('addEvent', { title: 'Add Event', year: new Date().getFullYear(), message: error });
    }
  });

};
exports.addRideshareGroupPost = function (req, res) {
  console.log(req.body);
  var areaID = req.body.startingLocation;
  var recurring = req.body.recurringFrequency;
  var pricePerkm = req.body.pricekm;
  var eventID = req.body.eventsList;
  var maxPassengers = req.body.maxPassengers;
  var username = cookie.parse(req.headers.cookie).user;
  var events = require("../modules/addRideshare.js");
  events.tryAddRideshare(username, maxPassengers, pricePerkm, eventID, recurring, areaID, function (success, error) {
    if (success) {
      res.redirect('/viewListOfRideshareGroups');
    } else {
      res.render('addRideshareGroup', { title: 'Add Rideshare Group', year: new Date().getFullYear(), message: error });
    }
  });
};


exports.editEventpost = function (req, res) {
  var eventID = req.body.eventID;
  var eventName = req.body.eventName;
  var eventCategory = req.body.eventCategory;
  var streetNumORVenueName = req.body.streetNumORVenueName;
  var streetName = req.body.streetName;
  var city = req.body.city;
  var date = req.body.date;
  var time = req.body.time;
  //merge date & time into "2016-09-13 00:00:00" format
  var dateformat = date.substring(6, 9) + "-" + date.substring(3, 4) + "-" + date.substring(0, 1);
  var datetime = dateformat + time + "00";
  var events = require("../modules/editEvent.js");
  events.tryEditEvent(eventID, eventName, eventCategory, streetNumORVenueName, streetName, city, datetime, function (success, error) {
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
  var username = cookie.parse(req.headers.cookie).user;
  var isAdministrator = cookie.parse(req.headers.cookie).isAdministrator;
  events.tryDeleteEvent(eventID, username, isAdministrator, function (success, error) {
    res.send(success);
  });
};

exports.addRideshare = function (req, res) {
  var rideshare = require("../modules/addRideshare.js");

  rideshare.tryAddRideshare(function (success, err) {

  });
};

exports.unblockUser = function (req, res) {
  var user = require("../modules/unblockUser.js");
  var username = cookie.parse(req.headers.cookie).user;
  var unblockID = req.body.unblockID;
  user.tryUnblockUser(username, unblockID, function (success, err) {

  });
};

exports.editUser = function (req, res) {
  var user = require("../modules/editUser.js");
  var username = cookie.parse(req.headers.cookie).user;
  var password = req.body.password;
  user.tryEditUser(username, password, function (success, err) {

  });
};

exports.editPetrolCost = function (req, res) {
  var rideshare = require("../modules/editPetrolCost.js");
  var rideshareNo = req.body.rideshareNo;
  var petrolCost = req.body.petrolCost;
  console.log(req.body);
  rideshare.tryEditPetrolCost(rideshareNo, petrolCost, function (success, err) {
    if (err)
      res.send(err);
    else res.send(true);
  });
};

exports.editRouteMarker = function (req, res) {
  var rideshare = require("../modules/editRouteMarker.js");
  var rideshareNo = req.body.rideshareNo;
  var areaID = req.body.areaID;
  var username = cookie.parse(req.headers.cookie).user;
  rideshare.tryEditRouteMarker(username, rideshareNo, areaID, function (success, err) {
    if (err)
      res.send(err);
    else res.send(true);
  });
};

exports.requesttoJoinRideshare = function (req, res) {
  var rideshare = require("../modules/requesttoJoinRideshare.js");
  var rideshareNo = req.body.rideshareNo;
  var areaID = req.body.areaID;
  var username = cookie.parse(req.headers.cookie).user;
  rideshare.tryRequesttoJoinRideshare(username, rideshareNo, areaID, function (success, err) {
    if (err)
      res.send(err);
    else res.send(true);

  });
};

exports.searchParticipatingRideshare = function (req, res) {
  var rideshare = require("../modules/searchParticipatingRideshare.js");
  var username = cookie.parse(req.headers.cookie).user;
  var searchTerm = req.body.searchTerm;
  rideshare.trySearchParticipatingRideshare(username, searchTerm, function (jsonObject) {
    res.json(jsonObject);
  });
};

exports.searchRideshare = function (req, res) {
  var rideshare = require("../modules/searchRideshare.js");
  var searchTerm = req.body.searchTerm;
  rideshare.trySearchRideshare(searchTerm, function (jsonObject) {
    res.json(jsonObject);
  });
};

exports.getUser = function (req, res) {
  var user = require("../modules/getUser.js");
  var username = cookie.parse(req.headers.cookie).user;
  user.tryGetUser(username, function (jsonObject) {
    res.json(jsonObject);
  });
};

exports.getRideshare = function (req, res) {
  var rideshare = require("../modules/getRideshare.js");
  var rideshareNo = req.body.rideshareNo;
  var username = cookie.parse(req.headers.cookie).user;
  rideshare.tryGetRideshare(username, rideshareNo, function (jsonObject) {
    res.json(jsonObject);
  });
};

exports.getParticipatingRideshares = function (req, res) {
  var rideshare = require("../modules/getParticipatingRideshare.js");
  var username = cookie.parse(req.headers.cookie).user;
  rideshare.tryGetParticipatingRideshare(username, function (jsonObject) {
    res.json(jsonObject);
  });
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

exports.getRouteMarker = function (req, res) {
  var route = require("../modules/getRouteMarker.js");
  var username = cookie.parse(req.headers.cookie).user;
  var rideshareNo = req.body.rideshareNo;
  route.tryGetRouteMarker(username, rideshareNo, function (jsonObject) {
    res.json(jsonObject);
  });
};

exports.getRoute = function (req, res) {
  var route = require("../modules/getRoute.js");
  var rideshareNo = req.body.rideshareNo;
  route.tryGetRoute(rideshareNo, function (jsonObject) {
    res.json(jsonObject);
  });
};

exports.getNotifications = function (req, res) {
  var notifications = require("../modules/getNotifications.js");
  var username = cookie.parse(req.headers.cookie).user;
  notifications.tryGetNotifications(username, function (jsonObject) {
    res.json(jsonObject);
  });
};

exports.getCalendar = function (req, res) {
  var calendar = require("../modules/getCalendar.js");
  var username = cookie.parse(req.headers.cookie).user;
  calendar.tryGetCalendar(username, function (jsonObject) {
    res.json(jsonObject);
  });
};

exports.queryOutstandingJoin = function (req, res) {
  var query = require("../modules/queryOutstandingJoin.js");
  query.tryQueryOutstandingJoin(function (jsonObject) {
    res.json(jsonObject);
  });
};