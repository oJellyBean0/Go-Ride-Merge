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

exports.tryEditRouteMarker = function (username, rideshareNo, areaID, callback) {
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

    var createNotification = function (userID, name, surname, driverID) {
        var tableName = '[JN08].[dbo].[Notification]';
        var sql = 'INSERT INTO ' + tableName;
        var request = new mssql.Request(connObj);
        request.input("NotificationMessage", mssql.Text, name + " " + surname + " has requested to Change their Pick-up Point");
        request.input("Trigger", mssql.VarChar, "");
        sql += " (NotificationMessage, [Trigger])";
        sql += " OUTPUT INSERTED.NotificationID";
        sql += " VALUES (@NotificationMessage, @Trigger)";
        request.query(sql, function (err, recordset) {
            if (err) errorHandler(err, sql);
            else notifyUser(recordset[0].NotificationID, driverID);
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
            else createNotification(userID, name, surname, recordset[0].DriverID);
        });
    };

    var changeRouteMarker = function (userID, name, surname) {
        var tableName = '[JN08].[dbo].[RouteMarker]';
        var sql = 'UPDATE ' + tableName;
        var request = new mssql.Request(connObj);
        request.input("AreaID", mssql.UniqueIdentifier, areaID);
        request.input("UserID", mssql.UniqueIdentifier, userID);
        request.input("RideshareNo", mssql.UniqueIdentifier, rideshareNo);
        sql += " SET AreaID=@AreaID";
        sql += " WHERE RideshareNo=@RideshareNo AND UserID=@UserID";
        request.query(sql, function (err, recordset) {
            if (err) errorHandler(err, sql);
            else getDriver(userID, name, surname);
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
            else changeRouteMarker(recordset[0].UserID, recordset[0].Name, recordset[0].Surname);
        });
    };

    var connObj = mssql.connect(dbConfig, function (err) {
        if (err) errorHandler(err, connectionError);
        else getID();
    });
};