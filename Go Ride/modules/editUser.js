var mssql = require('mssql');
var dbConfig = {
    server: 'openbox.nmmu.ac.za\\wrr',
    port: 1433,
    user: 'JN08User',
    password: '2yWkBhRQ',
    database: 'JN08',
    options: {
        encrypt: false,
        pool: {
            max: 100,
            min: 0,
            idleTimeoutMillis: 30000
        }
    }
};
var connectionError = 'Unable to Connect to Server';

exports.tryEditUser = function (username, password, callback) {
    var errorHandler = function (error, sql) {
        console.log(error);
        console.log(sql);
        connObj.close();
        callback(false, error);
    };
    var jsonObject = {
        users: []
    };

    var editUser = function () {
        var tableName = '[JN08].[dbo].[User]';
        var sql = "UPDATE " + tableName;
        var request = new mssql.Request(connObj);
        request.input("Username", mssql.NVarChar, username);
        request.input("Password", mssql.NVarChar, password);
        sql += " SET Password=@Password";
        sql += " WHERE Username=@Username";
        request.query(sql, function (err, recordset) {
            if (err) errorHandler(err, sql);
            else {
                connObj.close();
                callback(true);
            }
        });
    };

    var connObj = mssql.connect(dbConfig, function (err) {
        if (err) errorHandler(err, connectionError);
        else editUser();
    });
};