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


exports.tryLogin = function (username, password, callback) {
    var errorHandler = function (error, sql) {
        console.log(error);
        console.log(sql);
        connObj.close();
        callback(false, error);
    };
    var tableName = '[JN08].[dbo].[user]';
    var connObj = mssql.connect(dbConfig, function (err) {
        if (err) errorHandler(err, connectionError);
        else {
            var sql = 'SELECT Password, UserType FROM ' + tableName;
            var request = new mssql.Request(connObj);
            request.input('Username', mssql.NVarChar, username);
            sql += 'Where Username=@Username';
            request.query(sql, function (err, recordset) {
                if (err) errorHandler(err, sql);
                else {
                    if (recordset.length < 1 || recordset[0].Password != password) {
                        err = "Incorrect Username or Password";
                        callback(false, err);
                    }
                    else {
                        callback(true, (recordset[0].UserType == "Administrator") ? true : false);
                        connObj.close();
                    }
                }
            });
        }
    });
};