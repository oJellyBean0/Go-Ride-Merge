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

exports.tryGetNotifications = function (username, callback) {
    var errorHandler = function (error, sql) {
        console.log(error);
        console.log(sql);
        connObj.close();
        callback(false, error);
    };
    var jsonObject = {
        notifications: []
    };

    var getNotifications = function (userID) {
        var sql = 'SELECT n.* FROM [JN08].[dbo].[Notification] n, [JN08].[dbo].[NotifiedUser] nu';
        var request = new mssql.Request(connObj);
        request.input("UserID", mssql.UniqueIdentifier, userID);
        sql += " WHERE nu.UserID=@UserID";
        if (err) errorHandler(err, sql);
            else {
                jsonObject.notifications.push({
                    NotificationID: recordset[0].NotificationID,
                    NotificationMessage: recordset[0].NotificationMessage,
                    Trigger: recordset[0].Trigger,
                    Read: recordset[0].Read
                });
                callback(jsonObject);
            }
    };

    var getID = function () {
        var tableName = '[JN08].[dbo].[User]';
        var sql = 'SELECT UserID FROM ' + tableName;
        var request = new mssql.Request(connObj);
        request.input("Username", mssql.NVarChar, username);
        sql += " WHERE Username=@Username";
        request.query(sql, function (err, recordset) {
            if (err) errorHandler(err, sql);
            else getNotifications(recordset[0].UserID);
        });
    };

    var connObj = mssql.connect(dbConfig, function (err) {
        if (err) errorHandler(err, connectionError);
        else getID();
    });
};