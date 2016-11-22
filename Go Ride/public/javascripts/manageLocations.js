// Populate List .....................................................................................
$("#headerText").html("Locations");
// $(document).ready(function () {
//   $('#pac-input').on('input', function () {
//     var savedSearchTerm = $('#pac-input').val()
//     $.post('/event', {
//       searchTerm: savedSearchTerm
//     }, function (data) {
//       if (savedSearchTerm == $('#pac-input').val()) {
//         $('#locationList').empty()
//         $.each(data.events, createItem)
//       }
//     })
//   })

$('#details').hide()

// $('.list-group-item').click(function () {
// console.log(this)
// $('#details').show()
// })
// })

var JSON
var AreaID1
  // populate list
$.getJSON('/getLocations', {}, function (data) {
  console.log('posting')
  JSON = data
  $.each(data.locations, createItem)
})

var createItem = function (key, val) { // creates item, appends to list, makes clickable, loads required info from json
  var item = $('<a/>', {
    'class': 'list-group-item changeElement',
    'id': val.AreaID,
    'href': '#',
    html: "<span>" + val.StreetNumber + " " + val.StreetName + "</span><span style='text-align:right; float:right; color:#d3d3d3'> View </span>"
      // html: val.StreetNumber + ' ' + val.StreetName
  })
  item.appendTo('#locationList')
  item.click(function () {
    // $("#panelInfo").html($(this).attr('id'));
    var ID = $(this).attr('id')
    $.getJSON('/getLocations', {}, function (data) {
      console.log(data)
      $.each(data.locations, function (key, val) {
        if (ID == val.AreaID) {
          AreaID1 = val.AreaID
          var StreetNumber = val.StreetNumber
          var StreetName = val.StreetName
          var Town = val.Town
          var Nickname = val.Nickname
          $('#street_number').text(StreetNumber)
          $('#route').text(StreetName)
          $('#locality').text(Town)
          $('#administrative_area_level_1').text(Nickname)
          $('#panelInfo').text(Nickname + " @ " + StreetNumber + " " + StreetName)
        }
      })
    })
    $('#details').show()
  })
}

$('#acceptDeleteLocation').click(function () {
  // $.post("/deleteLocation", AreaID1, {}, String)    //need logan to verify, dont want to delete my only test entry XD
  $('#' + AreaID1).remove()
  console.log(AreaID1)
})

$('#initAddLocation').click(function () {
  $('#streetnumberInput').text(componentForm.street_number)
  $('#streetnameInput').text(componentForm.route)
  $('#townInput').val(componentForm.locality)
  $('#shortNameInput').val("Please enter a short name")
})


$('#addLocation').click(function () {
  $('#streetnumberInput').text(componentForm.street_number)
  $('#streetnameInput').text(componentForm.route)
  $('#townInput').val(componentForm.locality)
  $('#shortNameInput').val("Please enter a short name")
})

$('#addLocation').click(function () {
    var streetnumberInput = $("#street_number").val();
    var streetnameInput = $("#route").val();
    var townInput = $("#locality").val();
    var shortNameInput = $("#shortNameInput").val();
    if (streetnumberInput!=null&&streetnameInput!=null&&townInput!=null&&shortNameInput!=null){
    $.post("/editUser", {
      password: passwordInput
    }, function (success) {
      console.log(true);
    });
    }else{
      modal.dis
    }
  })




// *******************************GOOGLE API*************************

// This example displays an address form, using the autocomplete feature
// of the Google Places API to help users fill in the information.

// This example requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">

var placeSearch, autocomplete;
var componentForm = {
  street_number: 'short_name',
  route: 'long_name',
  locality: 'long_name',
  administrative_area_level_1: 'short_name',
  country: 'long_name',
  postal_code: 'short_name'
};

function initAutocomplete() {
  // Create the autocomplete object, restricting the search to geographical
  // location types.
  autocomplete = new google.maps.places.Autocomplete(
    /** @type {!HTMLInputElement} */
    (document.getElementById('autocomplete')), {
      types: ['geocode']
    });

  // When the user selects an address from the dropdown, populate the address
  // fields in the form.
  autocomplete.addListener('place_changed', fillInAddress);
}

function fillInAddress() {
  // Get the place details from the autocomplete object.
  var place = autocomplete.getPlace();

  for (var component in componentForm) {
    document.getElementById(component).value = '';
    document.getElementById(component).disabled = false;
  }

  // Get each component of the address from the place details
  // and fill the corresponding field on the form.
  for (var i = 0; i < place.address_components.length; i++) {
    var addressType = place.address_components[i].types[0];
    if (componentForm[addressType]) {
      var val = place.address_components[i][componentForm[addressType]];
      document.getElementById(addressType).value = val;
    }
  }
}

// Bias the autocomplete object to the user's geographical location,
// as supplied by the browser's 'navigator.geolocation' object.
function geolocate() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      var geolocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      var circle = new google.maps.Circle({
        center: geolocation,
        radius: position.coords.accuracy
      });
      autocomplete.setBounds(circle.getBounds());
    });
  }
}