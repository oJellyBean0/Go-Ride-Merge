$(document).ready(function () {
    $.post("/event", { searchTerm: "" }, function (data) {
        console.log("posting")
        $.each(data.events, function (key, val) {
            $("<a/>", {
                "class": "list-group-item",
                "href": "login",
                html: val.EventName
            }).appendTo("#eventList");

        });
    });
});
$("#searchBar").on("input", function () {
    var savedSearchTerm = $("#searchBar").val();
    $.post("/event", { searchTerm: savedSearchTerm }, function (data) {
        if (savedSearchTerm == $("#searchBar").val()) {
            $("#eventList").empty();
            $.each(data.events, function (key, val) {
                $("<a/>", {
                    "class": "list-group-item",
                    "href": "login",
                    html: val.EventName
                }).appendTo("#eventList");

            });

        }
    });
});

