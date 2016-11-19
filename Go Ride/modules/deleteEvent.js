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

exports.tryDeleteEvent = function (eventID, username, isAdministrator, callback) {
    var errorHandler = function (error, sql) {
        console.log(error);
        console.log(sql);
        callback(false, error);
    };

    var deleteEvent = function () {
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

    var testPermissions = function () {
        if (isAdministrator) { deleteEvent(); return; }
        var sql = 'SELECT null FROM [JN08].[dbo].[User] U, [JN08].[dbo].[Event] E';
        var request = new mssql.Request(connObj);
        request.input("Username", mssql.NVarChar, username);
        request.input("EventID", mssql.UniqueIdentifier, eventID);
        sql += " WHERE U.Username=@Username AND E.CreatorID=U.UserID AND E.EventID=@EventID";
        request.query(sql, function (err, recordset) {
            if (err) errorHandler(err, sql);
            else if (recordset.length > 0) deleteEvent();
            else callback(false, "Insufficient Permissions");
        });
    };

    var connObj = mssql.connect(dbConfig, function (err) {
        if (err) errorHandler(err, connectionError);
        else testPermissions();
    });
};