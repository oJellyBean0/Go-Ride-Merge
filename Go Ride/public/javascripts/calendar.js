<<<<<<< HEAD
$(document).ready(function () {
    $.getJSON( "/getCalendar", function(data) {
        console.log(data);
        $.each(data.agenda,createItem);
=======
$("#headerText").html("Agenda");
$(document).ready(function () {
    $.getJSON("/getCalendar", function (data) {
        console.log(data);
        $.each(data.agenda, createItem);
>>>>>>> original/master
    });
});

var createItem = function (key, val) {
    var dateAndTime = val.Date;
    var arr = dateAndTime.split('T');
    var date = arr[0];
    var timeArr = arr[1].split(':');
<<<<<<< HEAD
    var time = timeArr[0]+':'+timeArr[1];
    var item = $("<div/>", {
        "class": "list-group-item; changeElement",

        html: 
        "<div class='row'>"+
            "<div class='col-md-4'>"+
               "<div style = 'font-weight:normal'>"+date + ", " +time +"</div>"+
            "</div>"+
            "<div class='col-md-5'>"+
                "<div style = 'font-weight:normal'>"+ val.EventName +"</div>"+
            "</div>"+
            "<div class='col-md-3'>"+
                "<div style = 'font-weight:normal'>"+ val.DriverName +" "+val.DriverSurname +"</div>"+
            "</div>"+
        "</div>"
        
        
=======
    var time = timeArr[0] + ':' + timeArr[1];
    var item = $("<div/>", {
        "class": "list-group-item",

        html: "<div class='row'>" +
            "<div class='col-md-4'>" +
            "<label style = 'font-weight:normal'>" + date + ", " + time + "</label>" +
            "</div>" +
            "<div class='col-md-5'>" +
            "<label style = 'font-weight:normal'>" + val.EventName + "</label>" +
            "</div>" +
            "<div class='col-md-3'>" +
            "<label style = 'font-weight:normal'>" + val.DriverName + " " + val.DriverSurname + "</label>" +
            "</div>" +
            "</div>"
>>>>>>> original/master
    });
    console.log(val);
    item.appendTo("#agendaList");
};