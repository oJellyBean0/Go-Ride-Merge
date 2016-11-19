$(document).ready(function () {

    $("#searchBar").on("input", function () {
        var savedSearchTerm = $("#searchBar").val();
        $.post("/event", { searchTerm: savedSearchTerm }, function (data) {
            if (savedSearchTerm == $("#searchBar").val()) {
                $("#eventList").empty();
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
        "class": "list-group-item changeElement",
        "href": "editEvent?eventName=" + val.EventName,
        html: "<span>"+val.EventName+"</span><span style='text-align:right; float:right; color:#d3d3d3'> Edit </span>" 
    }).appendTo("#eventList");
};

$.getJSON("/categories", function (data) {
    console.log(data.categories[0].CategoryDescr)
    $.each(data.categories, function (key, val) {
        $("<option/>", {
            "class": "my-new-list",
            html: val.CategoryDescr
        }).appendTo("#dropdownMenu");
    });
});

