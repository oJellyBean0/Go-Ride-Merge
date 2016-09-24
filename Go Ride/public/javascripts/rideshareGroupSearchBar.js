$(document).ready(function () {

    $("#searchBar").on("input", function () {
        var savedSearchTerm = $("#searchBar").val();
        $.post("/searchParticipatingRideshares", { searchTerm: savedSearchTerm }, function (data) {
            
            if (savedSearchTerm == $("#searchBar").val()) {
                $("#eventList").empty();
                $.each(data.rideshares, createItem);
            }
        });
    });

    $.post("/searchParticipatingRideshares", { searchTerm: "" }, function (data) {
        console.log("posting");
        console.log(data);
        $.each(data.rideshares, createItem);
    });
});

var createItem = function (key, val) {
    $("<a/>", {
        "class": "list-group-item",
        html: val.Title
    }).appendTo("#eventList");
};