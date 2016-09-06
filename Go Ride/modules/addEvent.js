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

exports.tryAddEvent = function (username, eventName, eventCatagory, streetNumORVenueName, streetName, suburb, city, province, datetime, callback) {
    var errorHandler = function (error, sql) {
        console.log(error);
        console.log(sql);
        callback(false, error);
    };

    var getID = function () {
        var tableName = '[JN08].[dbo].[User]';
        var sql = 'SELECT IDNumber FROM ' + tableName;
        var request = new mssql.Request(connObj);
        request.input("Username", mssql.NVarChar, username);
        sql += " WHERE Username=@Username";
        request.query(sql, function (err, recordset) {
            if (err) {
                errorHandler(err, sql);
            }
            else {
                getCatagory(recordset[0].IDNumber);
            }
        });
    };

    var getCatagory = function (IDNumber) {
        var tableName = '[JN08].[dbo].[EventCatagory]';
        var sql = 'SELECT CatagoryID FROM ' + tableName;
        var request = new mssql.Request(connObj);
        request.input("CatagoryDescr", mssql.Text, eventCatagory);
        sql += " WHERE CatagoryDescr=@CatagoryDescr";
        request.query(sql, function (err, recordset) {
            if (err) {
                errorHandler(err, sql);
            }
            else {
                addEvent(IDNumber, recordset[0].CatagoryID);
            }
        });
    };

    var addEvent = function (IDNumber, CatagoryID) {
        var tableName = '[JN08].[dbo].[Event]';
        var sql = 'INSERT INTO ' + tableName;
        var request = new mssql.Request(connObj);
        request.input("EventName", mssql.VarChar, eventName);
        request.input("CreatorID", mssql.Char, IDNumber);
        request.input("CatagoryID", mssql.UniqueIdentifier, CatagoryID);
        request.input("StreetNumber", mssql.Int, streetNumORVenueName);
        request.input("StreetName", mssql.NVarChar, streetName);
        request.input("Town", mssql.NVarChar, city);
        request.input("Suburb", mssql.NVarChar, suburb);
        request.input("Date", mssql.SmallDateTime, datetime);
        sql += ' (EventID,EventName,CreatorID,CatagoryID,StreetNumber,StreetName,Town,Suburb,Date) VALUES (@EventName, @CreatorID,@CatagoryID,@StreetNumber,@StreetName,@Town,@Suburb,@Date)';
        request.query(sql, function (err, recordset) {
            if (err) {
                errorHandler(err, sql);
            }
            else {
                callback(true);
            }
        });
    };

    var connObj = mssql.connect(dbConfig, function (err) {
        if (err) {
            errorHandler(err, connectionError);
        }
        else {
            getID();
        }
    });
};