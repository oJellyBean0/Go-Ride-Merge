$("#headerText").html("Administrator Query");
$(document).ready(function () {
  console.log('starting')

  $('#details').hide()
  console.log('hidden')

  $('#getQuery').click(function () {
    $.getJSON('/queryOutstandingJoin', function (data) {
      $.each(data.joinRequests, function (key, val) {
        $("<a>" + "UserName:          " + val.UserName + "</a></br>").appendTo("#textbox");
        $("<a>" + "UserSurname:       " + val.UserSurname + "</a></br>").appendTo("#textbox");
        $("<a>" + "DriverName:        " + val.DriverName + "</a></br>").appendTo("#textbox");
        $("<a>" + "DriverSurname:     " + val.DriverSurname + "</a></br>").appendTo("#textbox");
        $("<a>" + "EventName:         " + val.EventName + "</a></br>").appendTo("#textbox");
        $("<a>" + "EventStreetNumber: " + val.EventStreetNumber + "</a></br>").appendTo("#textbox");
        $("<a>" + "EventStreetName:   " + val.EventStreetName + "</a></br>").appendTo("#textbox");
        $("<a>" + "EventTown:         " + val.EventTown + "</a></br>").appendTo("#textbox");
        $("<a>" + "EventDate:         " + val.EventDate + "</a></br>").appendTo("#textbox");
        $("<a>" + "LocationNickname:  " + val.LocationNickname + "</a></br>").appendTo("#textbox");
      });
    });
    $('#details').show()
  })
})