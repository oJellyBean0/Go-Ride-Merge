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

exports.tryRequesttoJoinRideshare = function (username, rideshareNo, areaID, callback) {
    var errorHandler = function (error, sql) {
        console.log(error);
        console.log(sql);
        connObj.close();
        callback(false, error);
    };

    var notifyUser = function (notificationID, userID) {
        var tableName = '[JN08].[dbo].[NotifiedUser]';
        var sql = 'INSERT INTO ' + tableName;
        var request = new mssql.Request(connObj);
        sql += " (NotificationID, UserID) VALUES ";
        request.input("NotificationID", mssql.UniqueIdentifier, notificationID);
        request.input("UserID", mssql.UniqueIdentifier, userID);
        sql += "(@NotificationID, @UserID)";
        request.query(sql, function (err, recordset) {
            if (err) errorHandler(err, sql);
            else callback(true);
        });
    };

    var createNotification = function (userID, name, surname, driverID, event) {
        var tableName = '[JN08].[dbo].[Notification]';
        var sql = 'INSERT INTO ' + tableName;
        var request = new mssql.Request(connObj);
        request.input("NotificationMessage", mssql.Text, name + " " + surname + " has requested to Join your rideshare to " + event);
        request.input("Trigger", mssql.VarChar, "");
        sql += " (NotificationMessage, [Trigger])";
        sql += " OUTPUT INSERTED.NotificationID";
        sql += " VALUES (@NotificationMessage, @Trigger)";
        request.query(sql, function (err, recordset) {
            if (err) errorHandler(err, sql);
            else notifyUser(recordset[0].NotificationID, driverID);
        });
    };

    var getEventName = function (userID, name, surname, driverID) {
        var tableName = '[JN08].[dbo].[RideshareGroup]';
        var sql = 'SELECT EventName FROM ' + tableName;
        var request = new mssql.Request(connObj);
        request.input("RideshareNo", mssql.UniqueIdentifier, rideshareNo);
        sql += " WHERE RideshareNo=@RideshareNo";
        request.query(sql, function (err, recordset) {
            if (err) errorHandler(err, sql);
            else createNotification(userID, name, surname, driverID, recordset[0].EventName);
        });
    };

    var getDriver = function (userID, name, surname) {
        var tableName = '[JN08].[dbo].[RideshareGroup]';
        var sql = 'SELECT DriverID FROM ' + tableName;
        var request = new mssql.Request(connObj);
        request.input("RideshareNo", mssql.UniqueIdentifier, rideshareNo);
        sql += " WHERE RideshareNo=@RideshareNo";
        request.query(sql, function (err, recordset) {
            if (err) errorHandler(err, sql);
            else getEventName(userID, name, surname, recordset[0].DriverID);
        });
    };

    var addPendingRouterMarker = function (userID, name, surname) {
        var tableName = '[JN08].[dbo].[PendingMarker]';
        var sql = 'INSERT INTO ' + tableName;
        var request = new mssql.Request(connObj);
        request.input("UserID", mssql.UniqueIdentifier, userID);
        request.input("AreaID", mssql.UniqueIdentifier, areaID);
        request.input("RideshareNo", mssql.UniqueIdentifier, rideshareNo);
        sql += " (UserID, AreaID, RideshareNo)";
        sql += " OUTPUT INSERTED.RouteMarkerID";
        sql += " VALUES (@UserID, @AreaID, @RideshareNo)";
        request.query(sql, function (err, recordset) {
            if (err) errorHandler(err, sql);
            else getDriver(recordset[0].UserID, name, surname);
        });
    };

    var getEventID = function (userID, name, surname, events, pendingEvents) {
        var tableName = '[JN08].[dbo].[RideshareGroup]';
        var sql = 'SELECT EventID FROM ' + tableName;
        var request = new mssql.Request(connObj);
        request.input("RideshareNo", mssql.UniqueIdentifier, rideshareNo);
        sql += " WHERE RideshareNo=@RideshareNo";
        request.query(sql, function (err, recordset) {
            if (err) errorHandler(err, sql);
            else if (events.indexOf(recordset[0].EventID) > -1 || pendingEvents.indexOf(recordset[0].EventID) > -1) {
                connObj.close();
                callback(false, "User is already going to this event");
            }
            else addPendingRouterMarker(userID, name, surname);
        });
    };

    var getPendingEvents = function (userID, name, surname, events) {
        var sql = 'SELECT ri.EventID FROM ';
        sql += "[JN08].[dbo].[PendingMarker] as ro ,";
        sql += "[JN08].[dbo].[RideshareGroup] as ri ";
        var request = new mssql.Request(connObj);
        request.input("UserID", mssql.UniqueIdentifier, userID);
        sql += "WHERE ro.UserID=@UserID and ri.RideshareNo=ro.RideshareNo";
        request.query(sql, function (err, recordset) {
            if (err) errorHandler(err, sql);
            else getEventID(userID, name, surname, events, recordset.map(function (item) { return item.EventID; }));
        });
    };

    var getEvents = function (userID, name, surname) {
        var sql = 'SELECT ri.EventID FROM ';
        sql += "[JN08].[dbo].[RouteMarker] as ro ,";
        sql += "[JN08].[dbo].[RideshareGroup] as ri ";
        var request = new mssql.Request(connObj);
        request.input("UserID", mssql.UniqueIdentifier, userID);
        sql += "WHERE ro.UserID=@UserID and ri.RideshareNo=ro.RideshareNo";
        request.query(sql, function (err, recordset) {
            if (err) errorHandler(err, sql);
            else getPendingEvents(userID, name, surname, recordset.map(function (item) { return item.EventID; }));
        });
    };

    var getID = function () {
        var tableName = '[JN08].[dbo].[User]';
        var sql = 'SELECT UserID, Name, Surname FROM ' + tableName;
        var request = new mssql.Request(connObj);
        request.input("Username", mssql.NVarChar, username);
        sql += " WHERE Username=@Username";
        request.query(sql, function (err, recordset) {
            if (err) errorHandler(err, sql);
            else getEvents(recordset[0].UserID, recordset[0].Name, recordset[0].Surname);
        });
    };

    var connObj = mssql.connect(dbConfig, function (err) {
        if (err) errorHandler(err, connectionError);
        else getID();
    });
};