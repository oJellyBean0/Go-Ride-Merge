var sql = require('node-mssql');
var config = {
    username: 'JN08User',
    password: '2yWkBhRQ',
    host: 'openbox.nmmu.ac.za\\wrr',
    db: 'JN08'
};

var errorHandler = function (error, sql) {
    console.log(error);
    console.log(sql);
    callback(false, error);
};


exports.tryLogin = function (username, password, callback) {
    //TODO escape strings
    var query = new sql.Query(config);
    query.table('[dbo].[user]');
    query.where({
        'Username': username
    });
    query.select(function (results) {
        console.log(results);
        if (results.length < 1 || results[0].Password != password) {
            err = "Incorrect Username or Password";
            callback(false, err);
        }
        else {
            callback(true);
        }
    }, errorHandler);
};