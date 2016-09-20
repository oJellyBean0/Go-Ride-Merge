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

exports.tryDeleteLocation = function (areaID, callback) {
    var errorHandler = function (error, sql) {
        console.log(error);
        console.log(sql);
        callback(false, error);
    };

    var deleteArea = function (areaID) {
        var tableName = '[JN08].[dbo].[Location]';
        var sql = "DELETE FROM " + tableName;
        var request = new mssql.Request(connObj);
        request.input("AreaID", mssql.UniqueIdentifier, areaID);
        sql += " WHERE AreaID=@AreaID";
        request.query(sql, function (err, recordset) {
            if (err) errorHandler(err, sql);
            else callback(true);
        });
    };

    var connObj = mssql.connect(dbConfig, function (err) {
        if (err) errorHandler(err, connectionError);
        else deleteArea(areaID);
    });
};