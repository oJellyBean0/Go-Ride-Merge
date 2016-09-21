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

