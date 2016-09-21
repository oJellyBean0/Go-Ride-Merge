// Populate List .....................................................................................

$(document).ready(function () {
  $('#pac-input').on('input', function () {
    var savedSearchTerm = $('#pac-input').val()
    $.post('/event', { searchTerm: savedSearchTerm }, function (data) {
      if (savedSearchTerm == $('#pac-input').val()) {
        $('#locationList').empty()
        $.each(data.events, createItem)
      }
    })
  })

  $('#details').hide()

  $('.list-group-item').click(function () {
    console.log(this)
    $('#details').show()
  })
})

$('.list-group-item').click(function () {
  var ID = $(this).attr('id')
  $.getJSON('/getLocations', {}, function (data) {
    console.log(data);
    $.each(data.locations, function (key, val) {
      if (ID == val.AreaID) {
        var StreetNumber = val.StreetNumber;
        var StreetName = val.StreetName;
        var Town = val.Town;
        var Suburb = val.Suburb;
        var Province = val.Province;
        $('#streetNumber').val(StreetNum);
        $('#streetName').val(StreetName);
        $('#suburb').val(Suburb);
        $('#city').val(Town);
        $('#province').val(Province);
      }})})})
var JSON;
$.getJSON('/getLocations', {}, function (data) {
  console.log('posting')
  JSON = data;
  $.each(data.locations, createItem)
})

var createItem = function (key, val) {
  var item = $('<a/>', {
    'class': 'list-group-item',
    'id': val.AreaID,
    'href': '#',
    html: val.StreetNumber + ' ' + val.StreetName + ' , ' + val.Suburb
  })
  item.appendTo('#locationList')
  item.click(function () {
  var ID = $(this).attr('id')
  $.getJSON('/getLocations', {}, function (data) {
    console.log(data);
    $.each(data.locations, function (key, val) {
      if (ID == val.AreaID) {
        var StreetNumber = val.StreetNumber;
        var StreetName = val.StreetName;
        var Town = val.Town;
        var Suburb = val.Suburb;
        $('#streetNumber').text(StreetNumber);
        $('#streetName').text(StreetName);
        $('#suburb').text(Suburb);
        $('#town').text(Town);
      }})})
    $("#details").show();
  });
};

// Google maps javascript api .........................................................................................................

// This example adds a search box to a map, using the Google Place Autocomplete
// feature. People can enter geographical searches. The search box will return a
// pick list containing a mix of places and predicted search terms.

// This example requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">

function initAutocomplete () {
  var map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: -33.963373, lng: 25.616230},
    zoom: 13,
    mapTypeId: 'roadmap'
  })

  // Create the search box and link it to the UI element.
  var input = document.getElementById('pac-input')
  var searchBox = new google.maps.places.SearchBox(input)
  // map.controls[google.maps.ControlPosition.TOP_LEFT].push(input)

  // Bias the SearchBox results towards current map's viewport.
  map.addListener('bounds_changed', function () {
    searchBox.setBounds(map.getBounds())
  })

  var markers = []
  // Listen for the event fired when the user selects a prediction and retrieve
  // more details for that place.
  searchBox.addListener('places_changed', function () {
    var places = searchBox.getPlaces()

    if (places.length == 0) {
      return
    }

    // Clear out the old markers.
    markers.forEach(function (marker) {
      marker.setMap(null)
    })
    markers = []

    // For each place, get the icon, name and location.
    var bounds = new google.maps.LatLngBounds()
    places.forEach(function (place) {
      if (!place.geometry) {
        console.log('Returned place contains no geometry')
        return
      }
      var icon = {
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25)
      }

      // Create a marker for each place.
      markers.push(new google.maps.Marker({
        map: map,
        icon: icon,
        title: place.name,
        position: place.geometry.location
      }))

      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport)
      } else {
        bounds.extend(place.geometry.location)
      }
    })
    map.fitBounds(bounds)
    setZoom(10)
  })
}
