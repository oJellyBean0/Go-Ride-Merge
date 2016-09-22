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

exports.tryAddRideshare = function (username, maxPassengers, pricePerkm, eventID, recurring, areaID, callback) {
    var errorHandler = function (error, sql) {
        console.log(error);
        console.log(sql);
        connObj.close();
        callback(false, error);
    };

    var getID = function () {
        var tableName = '[JN08].[dbo].[User]';
        var sql = 'SELECT UserID FROM ' + tableName;
        var request = new mssql.Request(connObj);
        request.input("Username", mssql.NVarChar, username);
        sql += " WHERE Username=@Username";
        request.query(sql, function (err, recordset) {
            if (err) errorHandler(err, sql);
            else addRideshare(recordset[0].UserID);
        });
    };

    var addRideshare = function (userID) {
        var tableName = '[JN08].[dbo].[RideshareGroup]';
        var sql = 'INSERT INTO ' + tableName;
        var request = new mssql.Request(connObj);
        request.input("DriverID", mssql.UniqueIdentifier, userID);
        request.input("MaxPassengers", mssql.Int, maxPassengers);
        request.input("PricePerkm", mssql.Float, pricePerkm);
        request.input("EventID", mssql.UniqueIdentifier, eventID);
        request.input("LockStatus", mssql.Bit, false);
        request.input("RecurringFrequency", mssql.NCHAR, recurring);
        sql += " (DriverID, MaxPassengers, PricePerkm, EventID, LockStatus, RecurringFrequency)";
        sql += " OUTPUT Inserted.[RideshareNo]";
        sql += " VALUES (@DriverID, @MaxPassengers, @PricePerkm, @EventID, @LockStatus, @RecurringFrequency)";
        request.query(sql, function (err, recordset) {
            if (err) errorHandler(err, sql);
            else addRouteMarker(userID, recordset[0].RideshareNo);
        });
    };

    var addRouteMarker = function (userID, rideshareNo) {
        var tableName = '[JN08].[dbo].[RouteMarker]';
        var sql = 'INSERT INTO ' + tableName;
        var request = new mssql.Request(connObj);
        request.input("RideshareNo", mssql.UniqueIdentifier, rideshareNo);
        request.input("UserID", mssql.UniqueIdentifier, userID);
        request.input("AreaID", mssql.UniqueIdentifier, areaID);
        request.input("Order", mssql.Int, 1);
        sql += " (RideshareNo, UserID, AreaID, [Order])";
        sql += " VALUES (@RideshareNo, @UserID, @AreaID, @Order)";
        request.query(sql, function (err, recordset) {
            if (err) errorHandler(err, sql);
            else {
                callback(true);
                connObj.close();
            }
        });
    };

    var connObj = mssql.connect(dbConfig, function (err) {
        if (err) errorHandler(err, connectionError);
        else getID();
    });
};