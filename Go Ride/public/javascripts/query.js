$(document).ready(function () {
    $.getJSON( "/queryOutstandingJoin", function(data) {
        console.log(data);
        $.each(data.joinRequests,createItem);
    });
});

var createItem = function (key, val) {
    var dateAndTime = val.EventDate;
    var arr = dateAndTime.split('T');
    var date = arr[0];
    var timeArr = arr[1].split(':');
    var time = timeArr[0]+':'+timeArr[1];

    var item = $("<div/>", {
        "class": "list-group-item; changeElement",

        html: 
        "<div class='row'>"+
            "<div class='col-md-9'>"+
               "<div style = 'font-weight:normal'>"+val.UserName +" "+ val.UserSurname+ " to "+ val.EventName+ " with " + val.DriverName + " " + val.DriverSurname +"</div>"+
            "</div>"+
            "<div class='col-md-3'; style = 'text-align:right'>"+
                "<div style = 'font-weight:normal'>"+ date +", "+time +"</div>"+
            "</div>"+
        "</div>"
        
    });
    item.appendTo("#pendingJoinRequests");
};