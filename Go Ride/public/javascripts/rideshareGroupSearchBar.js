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
    
    $('#viewRideshareDetails').hide();
    
});

var createItem = function (key, val) {
    var item = $("<a/>", {
        "class": "list-group-item",
        "data-RideshareNo": val.RideshareNo,
        html: val.Title
    });
    console.log(val);
    item.appendTo("#eventList");
    item.click(function (e) {
        var RideshareNo = e.target.getAttribute("data-RideshareNo");
        $('#carIcon').hide();
        $('#viewRideshareDetails').show();
        console.log(e.target.getAttribute("data-RideshareNo"));
        $.post( '/getRideshare',{ rideshareNo: RideshareNo}, function( data ) {
            console.log(data);
            var destination = data.rideshares[0].Destination;
            var driver = data.rideshares[0].Driver[0].Driver;
            $('#passengerList').empty();
            $.each(data.rideshares[0].Passengers, function (key, val) {
                var item1 = $("<p/>", {
                    html: val.Passenger
                });
                item1.appendTo('#passengerList');
                
            });
            if(data.rideshares[0].Passengers.length == 0){
                $('#passengerList').text('No Passengers');
            };
            
            var price = data.rideshares[0].Price;
            console.log(destination)
            $('#destination').text(destination);
            $('#driver').text(driver);
            $('#pricekm').text(price);
            $('#pricekmDialog').val(price);
        });
    });
};
