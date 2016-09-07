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

exports.tryGetCategories = function (callback) {
    var errorHandler = function (error, sql) {
        console.log(error);
        console.log(sql);
        callback(false, error);
    };
    var tableName = '[JN08].[dbo].[EventCategory]';
    var connObj = mssql.connect(dbConfig, function (err) {
        if (err) {
            errorHandler(err, connectionError);
        }
        else {
            var sql = "SELECT CategoryDescr FROM " + tableName;
            var request = new mssql.Request(connObj);
            request.query(sql, function (err, recordset) {
                connObj.close();
                if (err) {
                    errorHandler(err, sql);
                }
                else {
                    var jsonObject = {
                        categories: []
                    };
                    recordset.forEach(function (item) {
                        jsonObject.categories.push({
                            'CategoryDescr': item.CategoryDescr
                        });
                    });
                    callback(jsonObject);
                }
            });
        }
    });
};