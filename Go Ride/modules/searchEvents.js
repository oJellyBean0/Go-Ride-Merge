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

exports.trySearch = function (searchTerm, callback) {
    var errorHandler = function (error, sql) {
        console.log(error);
        console.log(sql);
        callback(false, error);
    };
    var tableName = '[JN08].[dbo].[Event]';
    var connObj = mssql.connect(dbConfig, function (err) {
        if (err) {
            errorHandler(err, connectionError);
        }
        else {
            var sql = 'SELECT Top 20 *, priority = CASE ';
            var request = new mssql.Request(connObj);
            request.input('frontMatch', mssql.VarChar, searchTerm + "%");
            request.input('fullMatch', mssql.VarChar, "%" + searchTerm + "%");
            sql += 'When EventName Like @frontmatch Then 1 ';
            sql += 'When EventName Like @fullmatch Then 2 ';
            sql += 'End FROM ' + tableName;
            sql += ' Where EventName Like @frontmatch Or EventName Like @fullmatch ';
            sql += 'Order By priority, EventName';
            request.query(sql, function (err, recordset) {
                connObj.close();
                if (err) {
                    errorHandler(err, sql);
                }
                else {
                    var jsonObject = {
                        events: []
                    };
                    recordset.forEach(function (item) {
                        jsonObject.events.push({
                            'EventID': item.EventID,
                            'EventName': item.EventName
                        });
                    });
                    callback(jsonObject);
                }
            });
        }
    });
};