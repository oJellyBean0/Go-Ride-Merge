$(document).ready(function () {
    $.getJSON( "/getCalendar", function(data) {
        console.log(data);
        $.each(data.agenda,createItem);
    });
});

var createItem = function (key, val) {
    var dateAndTime = val.Date;
    var arr = dateAndTime.split('T');
    var date = arr[0];
    var timeArr = arr[1].split(':');
    var time = timeArr[0]+':'+timeArr[1];
    var item = $("<div/>", {
        "class": "list-group-item",

        html: 
        "<div class='row'>"+
            "<div class='col-md-6'>"+
               "<label style = 'font-weight:normal'>"+date + ", " +time +"</label>"+
            "</div>"+
            "<div class='col-md-3'>"+
                "<label style = 'font-weight:normal'>"+ val.EventName +"</label>"+
            "</div>"+
            "<div class='col-md-3'>"+
                "<label style = 'font-weight:normal'>"+ val.DriverName +" "+val.DriverSurname +"</label>"+
            "</div>"+
        "</div>"
    });
    console.log(val);
    item.appendTo("#agendaList");
};