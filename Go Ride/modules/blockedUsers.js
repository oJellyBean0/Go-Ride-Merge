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

exports.tryBlockedUsers = function (username, callback) {
    var errorHandler = function (error, sql) {
        console.log(error);
        console.log(sql);
        callback(false, error);
    };
    var jsonObject = {
        users: []
    };

    var getID = function () {
        var tableName = '[JN08].[dbo].[Users]';
        var sql = "SELECT IDNumber FROM " + tableName;
        var request = new mssql.Request(connObj);
        request.input("Username", mssql.NVarChar, username);
        sql += " WHERE Username=@Username";
        request.query(sql, function (err, recordset) {
            if (err) {
                errorHandler(err, sql);
            }
            else {
                getBlocked(recordset[0].IDNumber);
            }
        });
    };

    var getBlocked = function (IDNumber) {
        var tableName = '[JN08].[dbo].[BlockedUser]';
        var sql = "SELECT IDNumber FROM " + tableName;
        var request = new mssql.Request(connObj);
        request.input("Username", mssql.NVarChar, username);
        sql += " WHERE Username=@Username";
        request.query(sql, function (err, recordset) {
            if (err) {
                errorHandler(err, sql);
            }
            else {
                getUsers("(" + recordset.join() + ")");
            }
        });
    };

    var getUsers = function (inList) {
        var tableName = '[JN08].[dbo].[Users]';
        var sql = "SELECT * FROM " + tableName;
        var request = new mssql.Request(connObj);
        request.input("List", mssql.NVarChar, inList);
        sql += " WHERE IDNumber in @List";
        request.query(sql, function (err, recordset) {
            connObj.close();
            if (err) {
                errorHandler(err, sql);
            }
            else {
                recordset.forEach(function (item) {
                    jsonObject.users.push({
                        'Username': item.Username,
                        'Name': item.Name,
                        'Surname': item.Surname,
                        'Picture': item.Picture
                    });
                });
                callback(jsonObject);
            }
        });
    };

    var connObj = mssql.connect(dbConfig, function (err) {
        if (err) {
            errorHandler(err, connectionError);
        }
        else {
            getEvent();
        }
    });
};