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

exports.tryBlockedUsers = function (username, callback) {
    var decimalToHex = function (d) {
        var hex = Number(d).toString(16);
        var padding = 2;
        while (hex.length < padding) {
            hex = "0" + hex;
        }
        return hex;
    };
    var errorHandler = function (error, sql) {
        console.log(error);
        console.log(sql);
        connObj.close();
        callback(false, error);
    };
    var jsonObject = {
        users: []
    };

    var getID = function () {
        var tableName = '[JN08].[dbo].[User]';
        var sql = "SELECT UserID FROM " + tableName;
        var request = new mssql.Request(connObj);
        request.input("Username", mssql.NVarChar, username);
        sql += " WHERE Username=@Username";
        request.query(sql, function (err, recordset) {
            if (err) errorHandler(err, sql);
            else getBlocked(recordset[0].UserID);
        });
    };

    var getBlocked = function (userID) {
        var tableName = '[JN08].[dbo].[BlockedUser]';
        var sql = "SELECT BlockedID FROM " + tableName;
        var request = new mssql.Request(connObj);
        request.input("BlockerID", mssql.NVarChar, userID);
        sql += " WHERE BlockerID=@BlockerID";
        request.query(sql, function (err, recordset) {
            if (err) errorHandler(err, sql);
            else getUsers("(\'" + recordset.map(function (item) { return item.BlockedID; }).join("\',\'") + "\')");
        });
    };

    var getUsers = function (inList) {
        if (inList == "()") { callback(false); return; }
        var tableName = '[JN08].[dbo].[User]';
        var sql = "SELECT * FROM " + tableName;
        var request = new mssql.Request(connObj);
        sql += " WHERE UserID in " + inList;
        request.query(sql, function (err, recordset) {
            if (err) errorHandler(err, sql);
            else {
                recordset.forEach(function (item) {
                    var image = item.Picture === null ? null : new Buffer(JSON.parse(JSON.stringify(item.Picture)).data.map(decimalToHex).join(""), 'hex').toString('base64');
                    jsonObject.users.push({
                        'Username': item.Username,
                        'Name': item.Name,
                        'Surname': item.Surname,
                        'Picture': image
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