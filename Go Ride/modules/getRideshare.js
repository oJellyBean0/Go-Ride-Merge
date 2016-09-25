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

exports.tryGetRideshare = function (username, RideshareNo, callback) {
    var errorHandler = function (error, sql) {
        console.log(error);
        console.log(sql);
        connObj.close();
        callback(false, error);
    };
    var jsonObject = {
        rideshares: []
    };

    var getDriver = function (recordset) {
        var Driver = [];
        recordset.forEach(function (element) {
            if (element.Order == 1) {
                Driver.push({
                    Driver: element.Name[element.Order - 1] + " " + element.Surname[element.Order - 1]
                });
            }
        });
        return Driver;
    };

    var getPassengers = function (recordset) {
        var Passengers = [];
        recordset.forEach(function (element) {
            if (element.Order != 1) {
                Passengers.push({
                    Passenger: element.Name[element.Order - 1] + " " + element.Surname[element.Order - 1]
                });
            }
        });
        return Passengers;
    };

    var getID = function (rideshareNo) {
        var tableName = '[JN08].[dbo].[User]';
        var sql = 'SELECT UserID FROM ' + tableName;
        var request = new mssql.Request(connObj);
        request.input("Username", mssql.NVarChar, username);
        sql += " WHERE Username=@Username";
        request.query(sql, function (err, recordset) {
            if (err) errorHandler(err, sql);
            else getRideshare(recordset[0].UserID, rideshareNo);
        });
    };

    var getRideshare = function (userID, rideshareNo) {
        var sql = "SELECT ri.RideshareNo, e.StreetNumber, e.StreetName, e.Town, ri.PricePerkm, d.[Name], d.Surname, p.[Name], p.Surname, ro.[Order]";
        sql += " FROM [JN08].[dbo].RouteMarker as ro, [JN08].[dbo].RideshareGroup as ri, [JN08].[dbo].[Event] as e, [JN08].[dbo].[User] as d, [JN08].[dbo].[User] as p";
        var request = new mssql.Request(connObj);
        request.input("RideshareNo", mssql.UniqueIdentifier, rideshareNo);
        sql += " WHERE ro.RideshareNo=@RideshareNo and ro.UserID=p.UserID and ro.RideshareNo=ri.RideshareNo and ri.EventID=e.EventID and ri.DriverID=d.UserID";
        request.query(sql, function (err, recordset) {
            if (err) errorHandler(err, sql);
            else {
                jsonObject.rideshares.push({
                    RideshareNo: recordset[0].RideshareNo,
                    Destination: recordset[0].StreetNumber + " " + recordset[0].StreetName + ", " + recordset[0].Town,
                    Price: recordset[0].PricePerkm,
                    Driver: getDriver(recordset),
                    Passengers: getPassengers(recordset),
                    isDriver: (userID == recordset[0].DriverID) ? true : false
                });
                callback(jsonObject);
            }
        });
    };

    var connObj = mssql.connect(dbConfig, function (err) {
        if (err) errorHandler(err, connectionError);
        else getID(RideshareNo);
    });
};