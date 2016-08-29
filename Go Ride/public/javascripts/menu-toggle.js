$("#menu-toggle").click(function (e) {
    e.preventDefault();
    $("#wrapper").toggleClass("toggled");
});

$(window).resize(function () {
    var wrapper = $("#wrapper");
    var toggling = wrapper.hasClass("toggled");
    if (toggling) {
        $("#wrapper").toggleClass("toggled");
    }
});