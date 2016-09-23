$(document).ready(function () {

    $("#searchBar").on("input", function () {
        var savedSearchTerm = $("#searchBar").val();
        $.post("/searchParticipatingRideshares", { searchTerm: savedSearchTerm }, function (data) {
            
            if (savedSearchTerm == $("#searchBar").val()) {
                $("#eventList").empty();
                $.each(data.events, createItem);
            }
        });
    });

    $.post("/searchParticipatingRideshares", { searchTerm: "" }, function (data) {
        console.log("posting");
        console.log(data);
        $.each(data.events, createItem);
    });
});

var createItem = function (key, val) {
    $("<a/>", {
        "class": "list-group-item",
        "href": "editEvent?eventName=" + val.EventName,
        html: val.EventName
    }).appendTo("#eventList");
};