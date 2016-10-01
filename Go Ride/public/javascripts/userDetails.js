var JSON
var Username
var Name
var Surname

$.getJSON('/getUser', {}, function (data) {
  JSON = data

  $('#usernameHeading').text(JSON.users.Username)
  $('#name').text(JSON.users.Name)
  $('#nameInput').text(JSON.users.Name)
  $('#surname').text(JSON.users.Surname)
  $('#surnameInput').text(JSON.users.Surname)
  $('#username').text(JSON.users.Username)
  $('#usernameInput').text(JSON.users.Username)
  $('#password').text(JSON.users.Password)
  $('#passwordInput').text(JSON.users.Password)
})

$('#submitUserDetails').click(function () {
  $.post("/editUser", , {}, String)    //need logan to verify, dont want to delete my only test entry XD
  $('#' + AreaID1).remove()
  console.log(AreaID1)
})

