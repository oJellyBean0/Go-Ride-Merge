var sql = require('node-mssql');
var config = {
    user: 'JN08User',
    password: '2yWkBhRQ',
    server: 'openbox.nmmu.ac.za\\wrr',
    database: 'JN08',

    options: {
        encrypt: false
    }
};


exports.tryLogin = function (username, password, err) {
    var connection = new sql.Connection(config, function (error) {
        err = error;
        return false;
    });
    var request = new sql.Request();
    request.query('select Password from User where Username=' + username, function (error, recordset) {
        if (!err) {
            console.log(recordset);
            if (recordset.length != 1) {
                err = "Invalid username and password.";
                return false;
            }
            else
                if (recordset[0].password != password) {
                    err = "Invalid username and password.";
                    return false;
                } else {
                    return true;
                }
        } else {
            console.log(error);
            err = error;
            return false;
        }
    });
};