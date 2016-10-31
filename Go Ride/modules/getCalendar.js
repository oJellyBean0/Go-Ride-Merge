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

exports.tryGetCalendar = function (username, callback) {
    var errorHandler = function (error, sql) {
        console.log(error);
        console.log(sql);
        connObj.close();
        callback(false, error);
    };
    var jsonObject = {
        agenda: []
    };

    var getAgenda = function (userID) {
        var sql = "SELECT e.EventName, e.Date, d.Name, d.Surname";
        sql += " FROM [JN08].[dbo].RouteMarker as ro, [JN08].[dbo].RideshareGroup as ri, [JN08].[dbo].[Event] as e, [JN08].[dbo].[User] as d";
        var request = new mssql.Request(connObj);
        request.input("UserID", mssql.UniqueIdentifier, userID);
        sql += " WHERE ro.UserID=@UserID and ro.RideshareNo=ri.RideshareNo and ri.EventID=e.EventID and ri.DriverID=d.UserID";
        request.query(sql, function (err, recordset) {
            if (err) errorHandler(err, sql);
            else {
                recordset.forEach(function (item) {
                    jsonObject.agenda.push({
                        EventName: item.EventName,
                        Date: item.Date,
                        DriverName: item.Name,
                        DriverSurname: item.Surname
                    });
                });
                callback(jsonObject);
            }
        });
    };

    var getID = function () {
        var tableName = '[JN08].[dbo].[User]';
        var sql = 'SELECT UserID FROM ' + tableName;
        var request = new mssql.Request(connObj);
        request.input("Username", mssql.NVarChar, username);
        sql += " WHERE Username=@Username";
        request.query(sql, function (err, recordset) {
            if (err) errorHandler(err, sql);
            else getAgenda(recordset[0].UserID);
        });
    };

    var connObj = mssql.connect(dbConfig, function (err) {
        if (err) errorHandler(err, connectionError);
        else getID();
    });
};