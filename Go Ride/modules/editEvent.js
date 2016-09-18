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

exports.tryEditEvent = function (eventID, eventName, eventCategory, streetNumORVenueName, streetName, suburb, city, province, datetime, callback) {
    var errorHandler = function (error, sql) {
        console.log(error);
        console.log(sql);
        connObj.close();
        callback(false, error);
    };

    var getCategory = function () {
        var tableName = '[JN08].[dbo].[EventCategory]';
        var sql = 'SELECT CategoryID FROM ' + tableName;
        var request = new mssql.Request(connObj);
        request.input("CategoryDescr", mssql.Text, eventCategory);
        sql += " WHERE CategoryDescr=@CategoryDescr";
        request.query(sql, function (err, recordset) {
            if (err) errorHandler(err, sql);
            else editEvent(recordset[0].CategoryID);
        });
    };

    var editEvent = function (CategoryID) {
        var tableName = '[JN08].[dbo].[Event]';
        var sql = 'UPDATE ' + tableName;
        var request = new mssql.Request(connObj);
        request.input("EventID", mssql.UniqueIdentifier, eventID);
        request.input("EventName", mssql.VarChar, eventName);
        request.input("CategoryID", mssql.UniqueIdentifier, CategoryID);
        request.input("StreetNumber", mssql.Int, streetNumORVenueName);
        request.input("StreetName", mssql.NVarChar, streetName);
        request.input("Town", mssql.NVarChar, city);
        request.input("Suburb", mssql.NVarChar, suburb);
        request.input("Province", mssql.NVarChar, province);
        request.input("Date", mssql.SmallDateTime, datetime);
        sql += ' SET';
        sql += ' EventName=@EventName,';
        sql += ' CategoryID=@CategoryID,';
        sql += ' StreetNumber=@StreetNumber,';
        sql += ' Town=@Town,';
        sql += ' Suburb=@Suburb,';
        sql += ' Province=@Province,';
        sql += ' Date=@Date';
        sql += ' WHERE EventID=@EventID';
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
        else getCategory();
    });
};