var sql = require('node-mssql');
var config = {
    username: 'JN08User',
    password: '2yWkBhRQ',
    host: 'openbox.nmmu.ac.za\\wrr',
    db: 'JN08'
};


exports.tryRegister = function (username, password, callback) {
    var query = new sql.Query(config);
    var success = false;
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
    }, function (error, sql) {
        console.log(error);
        console.log(sql);
        callback(false, error);
    });
};