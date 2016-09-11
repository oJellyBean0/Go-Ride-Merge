
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
app.post('/manageLocations', routes.manageLocations);        //not sure if this needs to be here?
app.get('/userDetails', routes.userDetails);
app.get('/contacts', routes.contacts);
app.post('/contacts', routes.contacts);
app.post('/userDelete', routes.userDelete);
app.get('/userDelete', routes.userDelete);
app.post('/event', routes.searchEvents);
app.get('/manageEvent', routes.manageEvent);
app.get('/addEvent', routes.addEvent);
app.post('/addEvent', routes.addEventpost);
app.get('/editEvent', routes.editEvent);
app.get('/viewProfile', routes.viewProfile);

//app.post('/editEvent', routes.editEventpost);
app.get('/categories', routes.getCategories);
app.get('/participatingRideshareGroups', routes.participatingRideshareGroups);

http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
