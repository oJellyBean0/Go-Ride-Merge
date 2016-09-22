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

    var getRideshares = function () {
        var sql = "SELECT ro.RideshareNo, d.Name, d.Surname, e.EventName";
        sql += " FROM [JN08].[dbo].[User] as a, [JN08].[dbo].RouteMarker as ro, [JN08].[dbo].RideshareGroup as ri, [JN08].[dbo].[User] as d, [JN08].[dbo].[Event] as e";
        var request = new mssql.Request(connObj);
        request.input("Username", mssql.NVarChar, username);
        sql += " WHERE a.Username=@Username";
        sql += " and ro.UserID=a.UserID";
        sql += " and ro.RideshareNo=ri.RideshareNo";
        sql += " and ri.DriverID=d.UserID";
        sql += " and ri.EventID=e.EventID";
        request.query(sql, function (err, recordset) {
            if (err) errorHandler(err, sql);
            else {
                recordset.forEach(function (element) {
                    jsonObject.rideshares.push({
                        RideshareNo: element.RideshareNo,
                        Title: element.Name + " " + element.Surname + " to " + element.EventName
                    });
                });
                callback(jsonObject);
            }
        });
    };

    var connObj = mssql.connect(dbConfig, function (err) {
        if (err) errorHandler(err, connectionError);
        else getRideshares();
    });
};