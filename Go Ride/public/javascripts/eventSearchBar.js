var createItem = function (key, val) {
    $("<a/>", {
        "class": "list-group-item",
        "href": "editEvent?eventName=" + val.EventName,
        html: val.EventName
    }).appendTo("#eventList");
};

$(document).ready(function () {
    
    $.post("/event", { searchTerm: "" }, function (data) {
        console.log("posting");
        $.each(data.events, createItem);
    });
});
$("#searchBar").on("input", function () {
    var savedSearchTerm = $("#searchBar").val();
    $.post("/event", { searchTerm: savedSearchTerm }, function (data) {
        if (savedSearchTerm == $("#searchBar").val()) {
            $("#eventList").empty();
            $.each(data.events, createItem);
        }
    });
});

$.getJSON( "/categories", function( data ) {
                console.log(data.categories[0].CategoryDescr)
                $.each( data.categories, function( key, val ) {
                  $( "<option/>", {
                    "class": "my-new-list",
                    html: val.CategoryDescr
                  }).appendTo( "#dropdownMenu" );   
                });
              });

