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

exports.tryGetRouteMarker = function (username, rideshareNo, callback) {
    var errorHandler = function (error, sql) {
        console.log(error);
        console.log(sql);
        connObj.close();
        callback(false, error);
    };
    var jsonObject = {
        marker: []
    };

    var getID = function () {
        var tableName = '[JN08].[dbo].[User]';
        var sql = "SELECT UserID FROM " + tableName;
        var request = new mssql.Request(connObj);
        request.input("Username", mssql.NVarChar, username);
        sql += " WHERE Username=@Username";
        request.query(sql, function (err, recordset) {
            if (err) errorHandler(err, sql);
            else getRouteMarker(recordset[0].UserID);
        });
    };

    var getRouteMarker = function (userID) {
        var tableName = '[JN08].[dbo].[RouteMarker]';
        var sql = "SELECT * FROM " + tableName;
        var request = new mssql.Request(connObj);
        request.input("UserID", mssql.UniqueIdentifier, userID);
        sql += "WHERE UserID=@UserID";
        request.query(sql, function (err, recordset) {
            if (err) errorHandler(err, sql);
            else {
                recordset.forEach(function (item) {
                    jsonObject.marker.push({
                        'RouteMarkerID': item.RouteMarkerID,
                        'AreaID': item.AreaID,
                        'Order': item.Order
                    });
                });
                callback(jsonObject);
                connObj.close();
            }
        });
    };

    var connObj = mssql.connect(dbConfig, function (err) {
        if (err) errorHandler(err, connectionError);
        else getID();
    });
};