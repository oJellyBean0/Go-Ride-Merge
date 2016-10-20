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

exports.tryEditPetrolCost = function (rideshareNo, petrolCost, callback) {
    var errorHandler = function (error, sql) {
        console.log(error);
        console.log(sql);
        connObj.close();
        callback(false, error);
    };

    var notifyUsers = function (notificationID, userIDs) {
        var tableName = '[JN08].[dbo].[NotifiedUser]';
        var sql = 'INSERT INTO ' + tableName;
        var request = new mssql.Request(connObj);
        sql += " (NotificationID, UserID) VALUES ";
        request.input("NotificationID", mssql.UniqueIdentifier, notificationID);
        userIDs.forEach(function (element, index) {
            request.input("UserID" + index, mssql.UniqueIdentifier, element);
            sql += "(@NotificationID, @UserID" + index + "), ";
        });
        sql = sql.slice(0, -2);
        request.query(sql, function (err, recordset) {
            if (err) errorHandler(err, sql);
            else callback(true);
        });
    };

    var getPassengers = function (notificationID) {
        var tableName = '[JN08].[dbo].[RouteMarker]';
        var sql = 'SELECT UserID FROM ' + tableName;
        var request = new mssql.Request(connObj);
        request.input("RideshareNo", mssql.UniqueIdentifier, rideshareNo);
        sql += " WHERE RideshareNo=@RideshareNo and [Order]!=1";
        request.query(sql, function (err, recordset) {
            if (err) errorHandler(err, sql);
            else notifyUsers(notificationID, Array.from(recordset, x => x.UserID));
        });
    };

    var createNotification = function (driverName) {
        var tableName = '[JN08].[dbo].[Notification]';
        var sql = 'INSERT INTO ' + tableName;
        var request = new mssql.Request(connObj);
        request.input("NotificationMessage", mssql.Text, "Rideshare with " + driverName + " has changed Petrol Cost");
        request.input("Trigger", mssql.VarChar, "");
        sql += " (NotificationMessage, [Trigger])";
        sql += " OUTPUT INSERTED.NotificationID";
        sql += " VALUES (@NotificationMessage, @Trigger)";
        request.query(sql, function (err, recordset) {
            if (err) errorHandler(err, sql);
            else getPassengers(recordset[0].NotificationID);
        });
    };

    var getDriver = function (driverID) {
        var tableName = '[JN08].[dbo].[User]';
        var sql = 'SELECT Name, Surname FROM ' + tableName;
        var request = new mssql.Request(connObj);
        request.input("UserID", mssql.UniqueIdentifier, driverID);
        sql += " WHERE UserID=@UserID";
        request.query(sql, function (err, recordset) {
            if (err) errorHandler(err, sql);
            else createNotification(recordset[0].Name + " " + recordset[0].Surname);
        });
    };

    var changePetrolCost = function () {
        var tableName = '[JN08].[dbo].[RideshareGroup]';
        var sql = 'UPDATE ' + tableName;
        var request = new mssql.Request(connObj);
        request.input("PricePerkm", mssql.Float, petrolCost);
        request.input("RideshareNo", mssql.UniqueIdentifier, rideshareNo);
        sql += " SET PricePerkm=@PricePerkm";
        sql += " OUTPUT INSERTED.DriverID";
        sql += " WHERE RideshareNo=@RideshareNo";
        request.query(sql, function (err, recordset) {
            if (err) errorHandler(err, sql);
            else getDriver(recordset[0].DriverID);
        });
    };

    var connObj = mssql.connect(dbConfig, function (err) {
        if (err) errorHandler(err, connectionError);
        else changePetrolCost();
    });
};