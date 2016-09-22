$(document).ready(function () {

    $.post("/event", { searchTerm: "" }, function (data) {
        console.log("posting");
        console.log(data.events);
        $.each(data.events,function (key, val) {
            $("<option/>", {
                
                "class": "my-new-list",
                html: val.EventName
            }).appendTo("#dropdownMenu");
    });
    }) 
});

$.getJSON("/getLocations", function (data) {
    console.log(data.locations)
    $.each(data.locations, function (key, val) {
        $("<option/>", {
            "class": "my-new-list",
            "value": val.AreaID,
            html: val.StreetNumber + " "+ val.StreetName +", "+ val.Town
        }).appendTo("#dropdownMenu2");
    });
});

