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
    'class': 'list-group-item',
    'id': val.Username,
    'href': '#',
    html: val.Username + ': ' + val.Name + ' ' + val.Surname
  })
  item.appendTo('#blockedUserList')
  item.click(function () {
          Username = val.Username
          console.log(Username + " adsfasdfsadf")
          Name = val.Name
          Surname = val.Surname
          $('#unblockUserHeading').text(Name + " " + Surname)
    $('#details').show()
  })
}

$('#unblockUserButton').click(function () {
  console.log(Username + " test");
})

// $('#unblockUserButton').click(function () {
//   $.post("/unblockUser", Username, {}, String);
//   $('#' + Username).remove();
//   console.log(Username);
//   console.log("test");
// })
