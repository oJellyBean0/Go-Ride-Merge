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

exports.tryDeleteEvent = function (eventID, callback) {
    var errorHandler = function (error, sql) {
        console.log(error);
        console.log(sql);
        callback(false, error);
    };

    var deleteEvent = function (eventID) {
        var tableName = '[JN08].[dbo].[Event]';
        var sql = "DELETE FROM " + tableName;
        var request = new mssql.Request(connObj);
        request.input("EventID", mssql.UniqueIdentifier, eventID);
        sql += " WHERE EventID=@EventID";
        request.query(sql, function (err, recordset) {
            if (err) errorHandler(err, sql);
            else callback(true);
        });
    };

    var connObj = mssql.connect(dbConfig, function (err) {
        if (err) {
            errorHandler(err, connectionError);
        }
        else {
            deleteEvent(eventID);
        }
    });
};