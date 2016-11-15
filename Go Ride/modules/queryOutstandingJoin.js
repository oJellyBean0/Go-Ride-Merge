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

exports.tryQueryOutstandingJoin = function (callback) {
    var errorHandler = function (error, sql) {
        console.log(error);
        console.log(sql);
        connObj.close();
        callback(false, error);
    };
    var jsonObject = {
        joinRequests: []
    };

    var getOutstandingJoin = function () {
        sql = "SELECT U.[Name] as UName, U.Surname as USurname,  ";
        sql += "D.[Name] as DName, D.Surname as DSurname,  ";
        sql += "E.EventName as EName, E.StreetNumber as EStrNum, E.StreetName as EStrNam, E.Town as ETown, E.[Date] as EDate,  ";
        sql += "L.Nickname as LNickname ";
        sql += " FROM [User] U, [User] D, [Event] E, [Location] L, PendingMarker PM, RideshareGroup RG ";
        sql += " WHERE NOT EXISTS (SELECT NULL FROM RouteMarker RM WHERE RM.UserID=PM.UserID AND RM.RideshareNo=PM.RideshareNo) AND ";
        sql += " PM.UserID = U.UserID AND PM.AreaID = L.AreaID AND PM.RideshareNo=RG.RideshareNo AND ";
        sql += " RG.EventID=E.EventID AND RG.DriverID=D.UserID ";
        sql += " ORDER BY E.EventName, U.[Name], U.Surname";
        var request = new mssql.Request(connObj);
        request.query(sql, function (err, recordset) {
            if (err) errorHandler(err, sql);
            else {
                recordset.forEach(function (item) {
                    jsonObject.joinRequests.push({
                        'UserName': item.UName,
                        'UserSurname': item.USurname,
                        'DriverName': item.DName,
                        'DriverSurname': item.DSurname,
                        'EventName': item.EName,
                        'EventStreeNumber': item.EStrNum,
                        'EventStreeName': item.EStrNam,
                        'EventTown': item.ETown,
                        'EventDate': item.EDate,
                        'LocationNickname': item.LNickname
                    });
                });
                callback(jsonObject);
                connObj.close();
            }
        });
    };

    var connObj = mssql.connect(dbConfig, function (err) {
        if (err) errorHandler(err, connectionError);
        else getOutstandingJoin();
    });
};