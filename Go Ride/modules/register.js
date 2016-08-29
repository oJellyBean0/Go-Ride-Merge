var sql = require('node-mssql');
var config = {
    username: 'JN08User',
    password: '2yWkBhRQ',
    host: 'openbox.nmmu.ac.za\\wrr',
    db: 'JN08'
};

var errorHandler = function (error, sql) {
    console.log(error);
    console.log(sql);
    callback(false, error);
};


exports.tryRegister = function (IDnumber, name, surname, username, password, picture, streetNumber, streetName, suburb, town, province, callback) {
    //TODO escape strings
    var query = new sql.Query(config);
    query.table('[dbo].[user]');
    query.where({
        'IDNumber': IDNumber
    });
    query.select(function (results) {
        if (results.length > 0) {
            err = "ID Number is already registered";
            callback(false, err);
        }
        query.where({
            'Username': username
        });
        query.select(function (results) {
            if (results.length > 0) {
                err = "Username is taken";
            }
            query.data({
                'IDNumber': IDnumber,
                'Name': name,
                'Surname': surname,
                'Username': username,
                'Password': password,
                'UserType': "Passenger",
                'Picture': picture,
                'Blocked': "0"
            });
            query.insert(function (results) {
                console.log(results);
                query.table('[dbo].[Location]');
                query.data({
                    'IDNumber': IDnumber,
                    'StreetNumber': streetNumber,
                    'StreetName': streetName,
                    'Suburb': suburb,
                    'Town': town,
                    'Province': province
                });
                query.insert(function (results) {
                    console.log(results);
                    callback(true);
                });
            }, errorHandler);
        }, errorHandler);
    }, errorHandler);
};