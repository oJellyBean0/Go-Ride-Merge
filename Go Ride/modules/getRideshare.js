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

exports.getRideshare = function (RideshareNo, callback) {
    var errorHandler = function (error, sql) {
        console.log(error);
        console.log(sql);
        connObj.close();
        callback(false, error);
    };
    var jsonObject = {
        rideshares: []
    };

    var getPassengerNames = function (userIDs) {
        if (inList == "()") { callback(false); return; }
        var tableName = '[JN08].[dbo].[User]';
        var sql = "SELECT * FROM " + tableName;
        var request = new mssql.Request(connObj);
        sql += " WHERE UserID in " + inList;
        request.query(sql, function (err, recordset) {
            if (err) errorHandler(err, sql);
            else {
                recordset.forEach(function (item) {
                    jsonObject.rideshares[0].Passengers.push({
                        FullName: item.Name + " " + item.Surname
                    });
                });
                callback(jsonObject);
                connObj.close();
            }
        });
    };

    var getPassengers = function (rideshareNo) {
        var tableName = '[JN08].[dbo].[RouteMarker]';
        var sql = "SELECT UserID FROM " + tableName;
        var request = new mssql.Request(connObj);
        request.input("RideshareNo", mssql.UniqueIdentifier, rideshareNo);
        sql += " WHERE RideshareNo=@RideshareNo";
        request.query(sql, function (err, recordset) {
            if (err) errorHandler(err, sql);
            else getPassengerNames("(\'" + recordset.map(function (item) { return item.UserID; }).join("\',\'") + "\')");
        });
    };

    var getDriverName = function (userID, rideshareNo) {
        var tableName = '[JN08].[dbo].[User]';
        var sql = "SELECT * FROM " + tableName;
        var request = new mssql.Request(connObj);
        request.input("UserID", mssql.UniqueIdentifier, userID);
        sql += " WHERE UserID=@UserID";
        request.query(sql, function (err, recordset) {
            if (err) errorHandler(err, sql);
            else {
                jsonObject.rideshares[0].Driver.push({
                    FullName: recordset[0].Name + " " + recordset[0].Surname
                });
                getPassengers(rideshareNo);
            }
        });
    };

    var getRideshare = function (rideshareNo) {
        var tableName = '[JN08].[dbo].[RouteMarker]';
        var sql = 'SELECT * FROM ' + tableName;
        var request = new mssql.Request(connObj);
        request.input("RideshareNo", mssql.UniqueIdentifier, rideshareNo);
        sql += " Where RideshareNo=@RideshareNo";
        request.query(sql, function (err, recordset) {
            if (err) errorHandler(err, sql);
            else {
                recordset.forEach(function (element) {
                    jsonObject.rideshares.push({
                        RideshareNo: element.RideshareNo,
                        Destination: getLocationName(element.EventID),
                        Price: element.PricePerkm,
                        Driver: [],
                        Passengers: []
                    });
                });
                getDriverName(element.DriverID, element.RideshareNo);
            }
        });
    };

    var connObj = mssql.connect(dbConfig, function (err) {
        if (err) errorHandler(err, connectionError);
        else getRideshare(RideshareNo);
    });
};