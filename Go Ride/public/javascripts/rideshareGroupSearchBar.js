$(document).ready(function () {

    $("#searchBar").on("input", function () {
        var savedSearchTerm = $("#searchBar").val();
        $.post("/event", { searchTerm: savedSearchTerm }, function (data) {
            if (savedSearchTerm == $("#searchBar").val()) {
                $(".eventList").empty();
                $.each(data.events, createItem);
            }
        });
    });

    $.post("/event", { searchTerm: "" }, function (data) {
        console.log("posting");
        $.each(data.events, createItem);
    });
});

var createItem = function (key, val) {
    $("<a/>", {
        "class": "list-group-item",
        "href": "editEvent?eventName=" + val.EventName,
        html: val.EventName
    }).appendTo(".eventList");
};

var createItem2 = function (key, val) {
    $("<a/>", {
        "class": "list-group-item",
        "href": "editEvent?eventName=" + val.EventName,
        html: val.EventName
    }).appendTo("#eventList2");
};
