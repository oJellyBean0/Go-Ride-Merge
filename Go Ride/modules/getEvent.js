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

exports.tryGetEvent = function (eventName, callback) {
    var errorHandler = function (error, sql) {
        console.log(error);
        console.log(sql);
        connObj.close();
        callback(false, error);
    };
    var jsonObject = {
        events: []
    };

    var getEvent = function () {
        var tableName = '[JN08].[dbo].[Event]';
        var sql = "SELECT * FROM " + tableName;
        var request = new mssql.Request(connObj);
        request.input("EventName", mssql.VarChar, eventName);
        sql += " WHERE EventName=@EventName";
        request.query(sql, function (err, recordset) {
            if (err) errorHandler(err, sql);
            else {
                recordset.forEach(function (item) {
                    jsonObject.events.push({
                        'EventID': item.EventID,
                        'StreetNumber': item.StreetNumber,
                        'StreetName': item.StreetName,
                        'Town': item.Town,
                        'Suburb': item.Suburb,
                        'Date': item.Date,
                        'Province': item.Province,
                        'CategoryID': item.CategoryID
                    });
                });
                getCategory();
            }
        });
    };
    var getCategory = function () {
        var tableName = '[JN08].[dbo].[EventCategory]';
        var sql = "SELECT CategoryDescr FROM " + tableName;
        var request = new mssql.Request(connObj);
        request.input("CategoryID", mssql.UniqueIdentifier, jsonObject.events[0].CategoryID);
        sql += "WHERE CategoryID=@CategoryID";
        request.query(sql, function (err, recordset) {
            if (err) errorHandler(err, sql);
            else {
                jsonObject.events[0].CategoryDescr = recordset[0].CategoryDescr;
                callback(jsonObject);
                connObj.close();
            }
        });
    };

    var connObj = mssql.connect(dbConfig, function (err) {
        if (err) errorHandler(err, connectionError);
        else getEvent();
    });
};