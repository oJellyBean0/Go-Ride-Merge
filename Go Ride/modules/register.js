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


exports.tryRegister = function (IDnumber, name, surname, username, password, picture, streetNumber, streetName, town, nickname, cellphone, driver, registration, callback) {
    var errorHandler = function (error, sql) {
        console.log(error);
        console.log(sql);
        connObj.close();
        callback(false, error);
    };
    var tableName = '[JN08].[dbo].[User]';

    var IDTest = function () {
        var sql = 'SELECT * FROM ' + tableName;
        var request = new mssql.Request(connObj);
        request.input('IDNumber', mssql.Char, IDnumber);
        sql += ' Where IDNumber=@IDNumber';
        request.query(sql, function (err, recordset) {
            if (err) errorHandler(err, sql);
            else {
                if (recordset.length > 0) {
                    err = "ID Number is already registered";
                    callback(false, err);
                } else UserTest();
            }
        });
    };

    var UserTest = function () {
        var sql = 'SELECT * FROM ' + tableName;
        var request = new mssql.Request(connObj);
        request.input('Username', mssql.NVarChar, username);
        sql += ' Where Username=@Username';
        request.query(sql, function (err, recordset) {
            if (err) errorHandler(err, sql);
            else {
                if (recordset.length > 0) {
                    err = "Username is taken";
                    callback(false, err);
                } else UserInsert();
            }
        });
    };

    var UserInsert = function () {
        var fs = require('fs');
        var gm = require('gm');
        var sql = 'INSERT INTO ' + tableName;
        var request = new mssql.Request(connObj);
        request.input('IDNumber', mssql.Char, IDnumber);
        request.input('Name', mssql.NVarChar, name);
        request.input('Surname', mssql.NVarChar, surname);
        request.input('Username', mssql.NVarChar, username);
        request.input('Password', mssql.NVarChar, password);
        request.input('UserType', mssql.NChar, "Passenger");
        request.input('Blocked', mssql.Bit, false);
        if (picture) {
            gm(picture.path).noProfile().resize('300', '300', '^').gravity('Center').crop('300', '300').write(picture.path, function (err) {
                if (err) errorHandler(err);
                else {
                    fs.readFile(picture.path, function (err, data) {
                        if (err) { callback(false, err); return; }
                        request.input('Picture', mssql.Image, data);
                        fs.unlink(picture.path);
                        sql += ' (IDNumber, Name, Surname, Username, Password, UserType, Blocked, Picture)';
                        sql += ' OUTPUT INSERTED.[UserID]';
                        sql += ' VALUES (@IDNumber, @Name, @Surname, @Username, @Password, @UserType, @Blocked, @Picture)';
                        request.query(sql, function (err, recordset) {
                            if (err) errorHandler(err, sql);
                            else LocationInsert(recordset[0].UserID);
                        });
                    });
                }
            });
        } else {
            sql += ' (IDNumber, Name, Surname, Username, Password, UserType, Blocked) VALUES (@IDNumber, @Name, @Surname, @Username, @Password, @UserType, @Blocked)';
            request.query(sql, function (err, recordset) {
                if (err) errorHandler(err, sql);
                else LocationInsert(recordset[0].UserID);
            });
        }
    };

    var LocationInsert = function (UserID) {
        var tableName = '[JN08].[dbo].[Location]';
        var sql = 'INSERT INTO ' + tableName;
        var request = new mssql.Request(connObj);
        request.input('UserID', mssql.UniqueIdentifier, UserID);
        request.input('StreetNumber', mssql.Int, streetNumber);
        request.input('StreetName', mssql.NVarChar, streetName);
        request.input('Town', mssql.NVarChar, town);
        request.input('Nickname', mssql.NVarChar, nickname);
        request.query(sql + '(UserID, StreetNumber, StreetName, Town, Nickname) VALUES (@UserID, @StreetNumber, @StreetName, @Town, @Nickname)', function (err, recordset) {
            if (err) errorHandler(err, sql);
            else
                if (driver == "on")
                { DriverInsert(UserID); }
                else {
                    callback(true);
                    connObj.close();
                }
        });
    };

    var DriverInsert = function (UserID) {
        var tableName = '[JN08].[dbo].[Driver]';
        var sql = 'INSERT INTO ' + tableName;
        var request = new mssql.Request(connObj);
        request.input('UserID', mssql.UniqueIdentifier, UserID);
        request.input('CarRegistrationNo', mssql.NVarChar, registration);
        request.input('Rating', mssql.Float, 0);
        request.input('CellphoneNo', mssql.Char, cellphone);
        sql += " VALUES (@UserID, @CarRegistrationNo, @Rating, @CellphoneNo)";
        request.query(sql, function (err, recordset) {
            if (err) errorHandler(err, sql);
            else {
                callback(true);
                connObj.close();
            }
        });
    };

    var connObj = mssql.connect(dbConfig, function (err) {
        if (err) errorHandler(err, connectionError);
        else IDTest();
    });
};