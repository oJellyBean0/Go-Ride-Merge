$(document).ready(function () {

    $.post("/event", { searchTerm: "" }, function (data) {
        console.log("posting");
        console.log(data.events);
        $.each(data.events,function (key, val) {
            var item =$("<a/>", {
                "value": val.EventID,
                "class": "my-new-list",
                html: val.EventName
            })
            item.appendTo("#requestList");
    });
    }) 
});