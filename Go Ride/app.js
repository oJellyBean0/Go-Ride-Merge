
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var sql = require('node-mssql');
var cookieParser = require('cookie-parser');

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
app.get('/registerUser', routes.registerUser);
app.get('/manageLocations', routes.manageLocations);
app.post('/login', routes.loginpost);
app.get('/userDetails', routes.userDetails);
app.post('/registerUser', routes.registerUser);
app.post('/manageLocations', routes.manageLocations);        //not sure if this needs to be here?

// var config = {
//     user: 'JN08User',
//     password: '2yWkBhRQ',
//     server: 'openbox.nmmu.ac.za\\wrr',
//     database: 'JN08',

//     options:{
//         encrypt: false
//     }
// }

// var connection = new sql.Connection(config, function(error){
//     //Implement error testing
// });

http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
