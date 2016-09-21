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
    $.post("/event", { searchTerm: "" }, function (data) {
        console.log("posting");
        $.each(data.events, searchEvent);
    });
});

var createItem = function (key, val) {
    $("<option/>", {
        "class": "list-group-item",
        html: val.EventName
    }).appendTo(".eventList");
};


var searchEvent = function(key,val){
        $('#item-type').selectize()};
var eventItem = function (key, val) {
    $("<option/>", {
        "class": "list-group-item",
        html: val.EventName
    }).appendTo(".eventList");
};

