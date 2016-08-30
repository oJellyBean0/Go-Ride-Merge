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
        var tableName = '[JN08].[dbo].[user]';
        var connObj = mssql.connect(dbConfig, function (err) {
            if (err) {
                errorHandler(err, '');
            }
            else {
                var sql = 'INSERT INTO ' + tableName;
                var request = new mssql.Request(connObj);
                request.input('IDNumber', mssql.Char, IDnumber);
                request.input('Name', mssql.NVarChar, name);
                request.input('Surname', mssql.NVarChar, surname);
                request.input('Username', mssql.NVarChar, username);
                request.input('Password', mssql.NVarChar, password);
                request.input('UserType', mssql.NChar, "Passenger");
                request.input('Blocked', mssql.Bit, "0");
                if (picture) {
                        request.query(sql + '(IDNumber, Name, Surname, Username, Password, UserType, Blocked, Picture) VALUES (@IDNumber, @Name, @Surname, @Username, @Password, @UserType, @Blocked, ' + picture + ')', function (err, recordset) {
                        connObj.close();
                        if (err) {
                            errorHandler(err, sql);
                        }
                        else {
                            LocationInsert();
                        }
                    });
                } else {
                    request.query(sql + '(IDNumber, Name, Surname, Username, Password, UserType, Blocked) VALUES (@IDNumber, @Name, @Surname, @Username, @Password, @UserType, @Blocked)', function (err, recordset) {
                        connObj.close();
                        if (err) {
                            errorHandler(err, sql);
                        }
                        else {
                            LocationInsert();
                        }
                    });
                }
            }
        });
    };

    var LocationInsert = function () {
        var tableName = '[JN08].[dbo].[Location]';
        var connObj = mssql.connect(dbConfig, function (err) {
            if (err) {
                errorHandler(err, '');
            }
            else {
                var sql = 'INSERT INTO ' + tableName;
                var request = new mssql.Request(connObj);
                request.input('IDNumber', mssql.Char, IDnumber);
                request.input('StreetNumber', mssql.Int, streetNumber);
                request.input('StreetName', mssql.NVarChar, streetName);
                request.input('Suburb', mssql.NVarChar, suburb);
                request.input('Town', mssql.NVarChar, town);
                request.input('Province', mssql.NVarChar, province);
                request.query(sql + '(IDNumber, StreetNumber, StreetName, Suburb, Town, Province) VALUES (@IDNumber, @StreetNumber, @StreetName, @Suburb, @Town, @Province)', function (err, recordset) {
                    connObj.close();
                    if (err) {
                        errorHandler(err, sql);
                    }
                    else {
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