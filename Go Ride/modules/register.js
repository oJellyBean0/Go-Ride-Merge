var sql = require('node-mssql');
var mssql = require('mssql');
var config = {
    username: 'JN08User',
    password: '2yWkBhRQ',
    host: 'openbox.nmmu.ac.za\\wrr',
    db: 'JN08'
};
var dbConfig = {
    server: config.host,
    port: config.port || 1433,
    user: config.username,
    password: config.password,
    database: config.db,
    options: {
        encrypt: config.encryption || false,
        pool: {
            max: 100,
            min: 0,
            idleTimeoutMillis: 30000
        }
    }
};


exports.tryRegister = function (IDnumber, name, surname, username, password, picture, streetNumber, streetName, suburb, town, province, callback) {
    //TODO escape strings
    var errorHandler = function (error, sql) {
        console.log(error);
        console.log(sql);
        callback(false, error);
    };

    var IDTest = function (results) {
        if (results.length > 0) {
            err = "ID Number is already registered";
            callback(false, err);
            return;
        }
        query.where({
            'Username': username
        });
        query.select(UserTest, errorHandler);
    };

    var UserTest = function (results) {
        if (results.length > 0) {
            err = "Username is taken";
            callback(false, err);
            return;
        }
        UserInsert();
    };

    var UserInsert = function () {
        var params = {
            'IDNumber': IDnumber,
            'Name': name,
            'Surname': surname,
            'Username': username,
            'Password': password,
            'UserType': "Passenger",
            'Blocked': "0"
        };
        var tableName = '[dbo].[user]';
        var connObj = mssql.connect(dbConfig, function (err) {
            if (err) {
                errorHandler(err, '');
            }
            else {
                var sql = 'INSERT INTO ' + tableName;
                sql += ' (' + Object.keys(params).join(',') + ') VALUES (';
                Object.keys(params).forEach(function (key) {
                    sql += '\'' + params[key] + '\', ';
                });
                sql = sql.slice(0, -2);
                sql += ')';
                var request = new mssql.Request(connObj);
                request.query(sql, function (err, recordset) {
                    connObj.close();
                    if (err) {
                        errorHandler(err, sql);
                    }
                    else {
                        console.log(recordset);
                        LocationInsert();
                    }
                });
            }
        });
    };

    var LocationInsert = function () {
        var params = {
            'IDNumber': IDnumber,
            'StreetNumber': streetNumber,
            'StreetName': streetName,
            'Suburb': suburb,
            'Town': town,
            'Province': province
        };
        var tableName = '[dbo].[Location]';
        var connObj = mssql.connect(dbConfig, function (err) {
            if (err) {
                errorHandler(err, '');
            }
            else {
                var sql = 'INSERT INTO ' + tableName;
                sql += ' (' + Object.keys(params).join(',') + ') VALUES (';
                Object.keys(params).forEach(function (key) {
                    sql += '\'' + params[key] + '\', ';
                });
                sql = sql.slice(0, -2);
                sql += ')';
                var request = new mssql.Request(connObj);
                request.query(sql, function (err, recordset) {
                    connObj.close();
                    if (err) {
                        errorHandler(err, sql);
                    }
                    else {
                        console.log(recordset);
                        callback(true);
                        return;
                    }
                });
            }
        });
    };

    var query = new sql.Query(config);
    query.table('[dbo].[user]');
    query.where({
        'IDNumber': IDnumber
    });
    query.select(IDTest, errorHandler);
};