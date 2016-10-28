﻿
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var sql = require('node-mssql');
var cookieParser = require('cookie-parser');
var multer = require('multer');
var upload = multer({ dest: 'uploads/' });

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser('cookiesecret'));


// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/about', routes.about);
app.get('/contact', routes.contact);
app.get('/login', routes.login);
app.post('/login', upload.array(), routes.loginpost);
app.get('/registerUser', routes.registerUser);
app.post('/registerUser', upload.single('picture'), routes.registerpost);
app.get('/manageLocations', routes.manageLocations);
app.get('/userDetails', routes.userDetails);
app.get('/contacts', routes.contacts);
app.post('/contacts', routes.contacts);
app.post('/userDelete', routes.userDelete);
app.get('/userDelete', routes.userDelete);
app.post('/event', routes.searchEvents);
app.post('/getEvent', routes.getEvent);
app.get('/manageEvent', routes.manageEvent);
app.get('/addEvent', routes.addEvent);
app.post('/addEvent', routes.addEventpost);
app.get('/editEvent', routes.editEvent);
app.post('/deleteEvent', routes.deleteEvent);
app.get('/viewProfile', routes.viewProfile);
app.get('/blocked', routes.getBlockedUsers);
app.post('/editEvent', routes.editEventpost);
app.get('/categories', routes.getCategories);
app.get('/viewListOfRideshareGroups', routes.viewListOfRideshareGroups);
app.get('/viewRideshareGroup', routes.viewRideshareGroup);
app.get('/addRideshareGroup', routes.addRideshareGroup);
app.post('/addRideshareGroup', routes.addRideshareGroupPost);
app.get('/getLocations', routes.getLocations);
app.post('/getProfile', routes.getProfile);
app.post('/addRideshare', routes.addRideshare);
app.get('/getParticipatingRideshares', routes.getParticipatingRideshares);
app.post('/searchParticipatingRideshares', routes.searchParticipatingRideshare);
app.post('/searchRideshares', routes.searchRideshare);
app.post('/getRideshare', routes.getRideshare);
app.post('/unblockUser', routes.unblockUser);
app.get('/getUser', routes.getUser);
app.post('/editUser', routes.editUser);
app.post('/editPetrolCost', routes.editPetrolCost);
app.post('/getRouteMarker', routes.getRouteMarker);
app.post('/getRoute', routes.getRoute);
app.post('/editRouteMarker', routes.editRouteMarker);
app.get('/processRideshareRequest', routes.processRideshareRequest);
app.get('/viewCalendar', routes.viewCalendar);
app.post('/requesttoJoinRideshare', routes.requesttoJoinRideshare);

http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
