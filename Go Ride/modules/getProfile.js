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

exports.tryGetProfile = function (userID, callback) {
    var errorHandler = function (error, sql) {
        console.log(error);
        console.log(sql);
        connObj.close();
        callback(false, error);
    };
    var jsonObject = {
        users: []
    };

    var decimalToHex = function (d) {
        var hex = Number(d).toString(16);
        var padding = 2;
        while (hex.length < padding) {
            hex = "0" + hex;
        }
        return hex;
    };

    var pad = function (num, size) {
        var s = num + "";
        while (s.length < size) s = "0" + s;
        return s;
    };

    var calculateAge = function (idNumber) {
        var tempDate = new Date(idNumber.substring(0, 2), idNumber.substring(2, 4) - 1, idNumber.substring(4, 6));
        var id_date = tempDate.getDate();
        var id_month = tempDate.getMonth();
        var id_year = tempDate.getFullYear();
        var fullDate = id_year + "-" + pad(id_month + 1, 2) + "-" + id_date;
        var birthday = new Date(fullDate);
        var ageDifMs = Date.now() - birthday.getTime();
        var ageDate = new Date(ageDifMs);
        return Math.abs(ageDate.getUTCFullYear() - 1970);
    };

    var getProfile = function (userID) {
        var tableName = '[JN08].[dbo].[User]';
        var sql = "SELECT * FROM " + tableName;
        var request = new mssql.Request(connObj);
        request.input("UserID", mssql.VarChar, userID);
        sql += " WHERE UserID=@UserID";
        request.query(sql, function (err, recordset) {
            if (err) errorHandler(err, sql);
            else {
                recordset.forEach(function (item) {
                    var image = item.Picture === null ? null : new Buffer(JSON.parse(JSON.stringify(item.Picture)).data.map(decimalToHex).join(""), 'hex').toString('base64');
                    jsonObject.users.push({
                        'Name': item.Name,
                        'Surname': item.Surname,
                        'Age': calculateAge(item.IDNumber),
                        'Picture': image
                    });
                });
                getLocation(userID);
            }
        });
    };

    var getLocation = function (userID) {
        var tableName = '[JN08].[dbo].[Location]';
        var sql = "SELECT TOP(1) * FROM " + tableName;
        var request = new mssql.Request(connObj);
        request.input("UserID", mssql.VarChar, userID);
        sql += " WHERE UserID=@UserID";
        request.query(sql, function (err, recordset) {
            if (err) errorHandler(err, sql);
            else {
                recordset.forEach(function (item) {
                    jsonObject.users[0].City = item.Town;
                });
                callback(jsonObject);
            }
        });
    };

    var connObj = mssql.connect(dbConfig, function (err) {
        if (err) errorHandler(err, connectionError);
        else getProfile(userID);
    });
};