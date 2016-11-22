var JSON
var Username
var Name
var Surname


// $("#headerText").html("User Details");
$(document).ready(function () {

  $.getJSON('/getUser', {}, function (data) {
    JSON = data;
    console.log("testTEXT");
    console.log(data.users.Name);
    $('#usernameHeading').text(JSON.users[0].Username);
    $('#name').text(JSON.users[0].Name);
    $('#nameInput').val(JSON.users[0].Name);
    $('#surname').text(JSON.users[0].Surname);
    $('#surnameInput').val(JSON.users[0].Surname);
    $('#username').text(JSON.users[0].Username);
    $('#usernameInput').val(JSON.users[0].Username);
    $('#password').val(JSON.users[0].Password);
    $('#passwordInput').val(JSON.users[0].Password);
  })



  $('#submitUserDetails').click(function () {
    var passwordInput = $("#passwordInput").val();
    console.log(passwordInput);
    if (passwordInput) {
      $.post("/editUser", {
        password: passwordInput
      }, function (success) {
        console.log(true);
      });
    } else {
      modal.dis
    }
  })

});

// ('#buttonEdit').click(function () {
//   console.output("asdfasdfasdf")
//   $('#nameInput').text(JSON.users[0].Name);
// })