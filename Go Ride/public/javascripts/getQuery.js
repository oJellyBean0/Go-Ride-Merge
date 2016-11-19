// Populate List .....................................................................................

// $(document).ready(function () {
//   $('#pac-input').on('input', function () {
//     var savedSearchTerm = $('#pac-input').val()
//     $.post('/event', { searchTerm: savedSearchTerm }, function (data) {
//       if (savedSearchTerm == $('#pac-input').val()) {
//         $('#locationList').empty()
//         $.each(data.events, createItem)
//       }
//     })
//   })
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
  // })

// populate list

// $.getJSON('/getLocations', {}, function (data) {
//   JSON = data
//   $.each(data.locations, createItem)
// })

// var createItem = function (key, val) { // creates item, appends to list, makes clickable, loads required info from json
//   var item = $('<a/>', {
//     // 'class': 'list-group-item',
//     // 'id': val.AreaID,
//     // 'href': '#',
//     html: 'UserName: ' + val.StreetNumber
//   })
//   item.appendTo('#locationList')
//   item.click(function () {
//     var ID = $(this).attr('id')
//     $.getJSON('/getLocations', {}, function (data) {
//       console.log(data)
//       $.each(data.locations, function (key, val) {
//         if (ID == val.AreaID) {
//           AreaID1 = val.AreaID
//           var StreetNumber = val.StreetNumber
//           var StreetName = val.StreetName
//           var Town = val.Town
//           var Province = val.Province
//           $('#street_number').text(StreetNumber)
//           $('#route').text(StreetName)
//           $('#locality').text(Town)
//           $('#administrative_area_level_1').text(Province)
//         }
//       })
//     })
//     $('#details').show()
//   })
// }

// $('#acceptDeleteLocation').click(function () {
//   // $.post("/deleteLocation", AreaID1, {}, String)    //need logan to verify, dont want to delete my only test entry XD
//   $('#' + AreaID1).remove()
//   console.log(AreaID1)
// })