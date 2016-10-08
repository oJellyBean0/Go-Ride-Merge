var JSON
var Username
var Name
var Surname



$(document).ready(function () {

$.getJSON('/getUser', {}, function (data) {
  JSON = data;
  console.log("testTEXT");
  console.log(data.users.Name);
  $('#usernameHeading').text(JSON.users[0].Username);
  $('#name').text(JSON.users[0].Name);
  $('#nameInput').text(JSON.users[0].Name);
  $('#surname').text(JSON.users[0].Surname);
  $('#surnameInput').text(JSON.users[0].Surname);
  $('#username').text(JSON.users[0].Username);
  $('#usernameInput').text(JSON.users[0].Username);
  $('#password').text(JSON.users[0].Password);
  $('#passwordInput').text(JSON.users[0].Password);
})

$('#submitUserDetails').click(function () {
  $.post("/editUser");
  $('#' + AreaID1).remove();
  console.log(AreaID1);
})

});

('#buttonEdit').click(function () {
    console.output("asdfasdfasdf")
    $('#nameInput').text(JSON.users[0].Name);
})

