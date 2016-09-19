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

exports.tryAddEvent = function (username, eventName, eventCategory, streetNumORVenueName, streetName, suburb, city, province, datetime, callback) {
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
            else getCategory(recordset[0].UserID);
        });
    };

    var getCategory = function (userID) {
        var tableName = '[JN08].[dbo].[EventCategory]';
        var sql = 'SELECT CategoryID FROM ' + tableName;
        var request = new mssql.Request(connObj);
        request.input("CategoryDescr", mssql.Text, eventCategory);
        sql += " WHERE CategoryDescr Like @CategoryDescr";
        request.query(sql, function (err, recordset) {
            if (err) errorHandler(err, sql);
            else addEvent(userID, recordset[0].CategoryID);
        });
    };

    var addEvent = function (userID, CategoryID) {
        var tableName = '[JN08].[dbo].[Event]';
        var sql = 'INSERT INTO ' + tableName;
        var request = new mssql.Request(connObj);
        request.input("EventName", mssql.VarChar, eventName);
        request.input("CreatorID", mssql.UniqueIdentifier, userID);
        request.input("CategoryID", mssql.UniqueIdentifier, CategoryID);
        request.input("StreetNumber", mssql.Int, streetNumORVenueName);
        request.input("StreetName", mssql.NVarChar, streetName);
        request.input("Town", mssql.NVarChar, city);
        request.input("Suburb", mssql.NVarChar, suburb);
        request.input("Province", mssql.NVarChar, province);
        request.input("Date", mssql.VarChar, datetime);
        sql += ' (EventName,CreatorID,CategoryID,StreetNumber,StreetName,Town,Suburb,Province,Date) VALUES (@EventName, @CreatorID,@CategoryID,@StreetNumber,@StreetName,@Town,@Suburb,@Province,@Date)';
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