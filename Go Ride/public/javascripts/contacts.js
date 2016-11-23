$("#headerText").html("Unblock Users");

$('#details').hide()

var JSON
var Username
var Name
var Surname

$.getJSON('/blocked', {}, function (data) {
  console.log('posting')
  JSON = data
  $.each(data.users, createItem)
})

var createItem = function (key, val) {
  var item = $('<a/>', {
    'class': 'list-group-item changeElement',
    'data-toggle': "modal",
    'data-target': "#modalUnblock",
    'id': val.Username,
    'href': '#',
    // html: val.Username + ': ' + val.Name + ' ' + val.Surname
    html: "<span>" + val.Name + " " + val.Surname + "</span><span style='text-align:right; float:right; color:#d3d3d3'> Unblock </span>"
  })
  item.appendTo('#blockedUserList')
  item.click(function () {
    Username = val.Username
    Name = val.Name
    Surname = val.Surname
    $("#modalUnblockHeader").text("Unblock " + Name + " " + Surname);
  })
}

$('#unblockUserButton').click(function () {
  $.post("/unblockUser", {
    username: Username
  }, function (success) {
    console.log(true);
    window.location.replace("/contacts");
  });
})