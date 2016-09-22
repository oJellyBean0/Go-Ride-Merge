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

exports.tryUnblockUser = function (username, unblockID, callback) {
    var errorHandler = function (error, sql) {
        console.log(error);
        console.log(sql);
        connObj.close();
        callback(false, error);
    };

    var unsetBlock = function () {
        var tableName = '[JN08].[dbo].[User]';
        var sql = 'UPDATE ' + tableName;
        var request = new mssql.Request(connObj);
        request.input("UserID", mssql.UniqueIdentifier, unblockID);
        request.input("Blocked", mssql.Bit, false);
        sql += " SET Blocked=@Blocked";
        sql += " WHERE UserID=@UserID";
        request.query(sql, function (err, recordset) {
            if (err) errorHandler(err, sql);
            else {
                connObj.close();
                callback(true);
            }
        });
    };

    var testUser = function () {
        var tableName = '[JN08].[dbo].[BlockedUser]';
        var sql = 'Select * FROM ' + tableName;
        var request = new mssql.Request(connObj);
        request.input("BlockedID", mssql.UniqueIdentifier, unblockID);
        sql += " WHERE BlockedID=@BlockedID";
        request.query(sql, function (err, recordset) {
            if (err) errorHandler(err, sql);
            else {
                if (recordset.length > 0) unsetBlock();
                else {
                    connObj.close();
                    callback(true);
                }
            }
        });
    };

    var unblockUser = function (userID) {
        var tableName = '[JN08].[dbo].[BlockedUser]';
        var sql = 'DELETE FROM ' + tableName;
        var request = new mssql.Request(connObj);
        request.input("BlockerID", mssql.UniqueIdentifier, userID);
        request.input("BlockedID", mssql.UniqueIdentifier, unblockID);
        sql += " WHERE BlockedID=@BlockedID AND BlockerID=@BlockerID";
        request.query(sql, function (err, recordset) {
            if (err) errorHandler(err, sql);
            else testUser();
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
            else unblockUser(recordset[0].UserID);
        });
    };

    var connObj = mssql.connect(dbConfig, function (err) {
        if (err) errorHandler(err, connectionError);
        else getID();
    });
};