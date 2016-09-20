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

exports.getParticipatingRideshare = function (username, callback) {
    var errorHandler = function (error, sql) {
        console.log(error);
        console.log(sql);
        connObj.close();
        callback(false, error);
    };
    var jsonObject = {
        rideshares: []
    };

    var getDriverName = function (userID) {
        var FullName;
        var tableName = '[JN08].[dbo].[User]';
        var sql = "SELECT * FROM " + tableName;
        var request = new mssql.Request(connObj);
        request.input("UserID", mssql.UniqueIdentifier, userID);
        sql += " WHERE UserID=@UserID";
        request.execute(sql, function (err, recordset) {
            if (err) errorHandler(err, sql);
            else FullName = recordset[0].Name + " " + recordset[0].Surname;
        });
        if (FullName)
         return FullName;
    };

    var getLocationName = function (eventID) {
        var EventName;
        var tableName = '[JN08].[dbo].[Event]';
        var sql = "SELECT * FROM " + tableName;
        var request = new mssql.Request(connObj);
        request.input("EventID", mssql.UniqueIdentifier, eventID);
        sql += " WHERE EventID=@EventID";
        request.execute(sql, function (err, recordset) {
            if (err) errorHandler(err, sql);
            else EventName = recordset[0].EventName;
        });
        if (EventName)
         return EventName;
    };

    var getTitle = function (RideshareNo) {
        var DriverID, EventID;
        var tableName = '[JN08].[dbo].[RideshareGroup]';
        var sql = 'SELECT DriverID, EventID FROM ' + tableName;
        var request = new mssql.Request(connObj);
        request.input("RideshareNo", mssql.UniqueIdentifier, RideshareNo);
        sql += " WHERE RideshareNo=@RideshareNo";
        request.execute(sql, function (err, recordset) {
            if (err) errorHandler(err, sql);
            else {
                DriverID = recordset[0].DriverID;
                EventID = recordset[0].EventID;
            }
        });
        if (DriverID && EventID)
         return getDriverName(DriverID) + " to " + getLocationName(EventID);
    };

    var getID = function () {
        var tableName = '[JN08].[dbo].[User]';
        var sql = 'SELECT UserID FROM ' + tableName;
        var request = new mssql.Request(connObj);
        request.input("Username", mssql.NVarChar, username);
        sql += " WHERE Username=@Username";
        request.query(sql, function (err, recordset) {
            if (err) errorHandler(err, sql);
            else getRideshares(recordset[0].UserID);
        });
    };

    var getRideshares = function (userID) {
        var tableName = '[JN08].[dbo].[RouteMarker]';
        var sql = 'SELECT RideshareNo FROM ' + tableName;
        var request = new mssql.Request(connObj);
        request.input("UserID", mssql.UniqueIdentifier, userID);
        sql += " Where UserID=@UserID";
        request.query(sql, function (err, recordset) {
            if (err) errorHandler(err, sql);
            else {
                recordset.forEach(function (element) {
                    jsonObject.rideshares.push({
                        RideshareNo: element.RideshareNo,
                        Title: getTitle(element.RideshareNo)
                    });
                });
                callback(jsonObject);
            }
        });
    };

    var connObj = mssql.connect(dbConfig, function (err) {
        if (err) errorHandler(err, connectionError);
        else getID();
    });
};