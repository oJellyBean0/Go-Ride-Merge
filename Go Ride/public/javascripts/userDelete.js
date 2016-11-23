$("#headerText").html("Delete Account");

$('#confirmDelete').click(function () {
    // var passwordInput = $("#passwordInput").val();
    // console.log(passwordInput);
    $.post("/editUser", {
        // password: passwordInput
      }, function (success) {
        console.log(true);
      });
  })