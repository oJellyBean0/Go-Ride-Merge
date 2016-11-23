$("#headerText").html("Delete Account");

$('#confirmDelete').click(function () {
  $.post("/deleteUser", {
    unblockUsername: ""
  }, function (success) {
    if (success === true) {
      var cookies = document.cookie.split(";");
      for (var i = 0; i < cookies.length; i++) {
        var equals = cookies[i].indexOf("=");
        var name = equals > -1 ? cookies[i].substr(0, equals) : cookies[i];
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
      }
      window.location.replace("/");
    }
  });
});