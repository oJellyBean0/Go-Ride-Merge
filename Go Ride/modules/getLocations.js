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

exports.tryGetLocations = function (username, callback) {
    var errorHandler = function (error, sql) {
        console.log(error);
        console.log(sql);
        callback(false, error);
    };
    var jsonObject = {
        locations: []
    };

    var getID = function () {
        var tableName = '[JN08].[dbo].[User]';
        var sql = "SELECT IDNumber FROM " + tableName;
        var request = new mssql.Request(connObj);
        request.input("Username", mssql.NVarChar, username);
        sql += " WHERE Username=@Username";
        request.query(sql, function (err, recordset) {
            if (err) {
                errorHandler(err, sql);
            }
            else {
                getLocations(recordset[0].IDNumber);
            }
        });
    };

    var getLocations = function (IDNumber) {
        var tableName = '[JN08].[dbo].[Location]';
        var sql = "SELECT * FROM " + tableName;
        var request = new mssql.Request(connObj);
        request.input("IDNumber", mssql.Char, IDNumber);
        sql += "WHERE IDNumber=@IDNumber";
        request.query(sql, function (err, recordset) {
            connObj.close();
            if (err) {
                errorHandler(err, sql);
            }
            else {
                recordset.forEach(function (item) {
                    jsonObject.locations.push({
                        'AreaID': item.AreaID,
                        'StreetNumber': item.StreetNumber,
                        'StreetName': item.StreetName,
                        'Suburb': item.Suburb,
                        'Town': item.Town,
                        'Province': item.Province
                    });
                });
                callback(jsonObject);
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