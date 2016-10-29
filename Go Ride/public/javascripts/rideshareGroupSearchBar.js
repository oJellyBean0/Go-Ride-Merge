$(document).ready(function () {

    $("#filterRideshareGroups").click(function (e) {
        var filterType = $("#filterRideshareGroups").attr("data-filterType");
        console.log($("#filterRideshareGroups").attr("data-filterType"));
        if (filterType == "all") {
            $("#filterRideshareGroups span").text('Filter All');
            $("#filterRideshareGroups").attr("data-filterType", "own");
            console.log($("#filterRideshareGroups").attr("data-filterType"));
            $("#filterRideshareGroups").css({ position: "relative", left: "-10" });
            var savedSearchTerm = $("#searchBar").val();
            $.post("/searchParticipatingRideshares", { searchTerm: savedSearchTerm }, function (data) {

                if (savedSearchTerm == $("#searchBar").val()) {
                    $("#eventList").empty();
                    $.each(data.rideshares, createItem);
                }
            });
        }
        else if (filterType == "own") {
            $("#filterRideshareGroups span").text("Filter Own List")
            $("#filterRideshareGroups").attr("data-filterType", "all");
            console.log($("#filterRideshareGroups").attr("data-filterType"));
            $("#filterRideshareGroups").css({ position: "relative", left: "-50" });
            var savedSearchTerm = $("#searchBar").val();
            $.post("/searchRideshares", { searchTerm: savedSearchTerm }, function (data) {

                if (savedSearchTerm == $("#searchBar").val()) {
                    $("#eventList").empty();
                    $.each(data.rideshares, createItem);
                }
            });
        } else {
            console.log("You fucked up");
        }
    })

    $("#searchBar").on("input", function () {
        var savedSearchTerm = $("#searchBar").val();
        var filterType = $("#filterRideshareGroups").attr("data-filterType");
        console.log(filterType);
        if (filterType == "own") {
            $.post("/searchParticipatingRideshares", { searchTerm: savedSearchTerm }, function (data) {

                if (savedSearchTerm == $("#searchBar").val()) {
                    $("#eventList").empty();
                    $.each(data.rideshares, createItem);
                }
            });
        }
        else {
            $.post("/searchRideshares", { searchTerm: savedSearchTerm }, function (data) {

                if (savedSearchTerm == $("#searchBar").val()) {
                    $("#eventList").empty();
                    $.each(data.rideshares, createItem);
                }
            });
        }
    });

    $.post("/searchParticipatingRideshares", { searchTerm: "" }, function (data) {

        console.log("posting");
        console.log(data);
        $.each(data.rideshares, createItem);
    });

    $('#viewRideshareDetails').hide();

    $.post("/event", { searchTerm: "" }, function (data) {
        console.log("posting");
        console.log(data.events);
        $.each(data.events,function (key, val) {
            $("<option/>", {
                "value": val.EventID,
                "class": "my-new-list",
                html: val.EventName
            }).appendTo("#dropdownMenu");
    });
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
        $.post('/getRideshare', { rideshareNo: RideshareNo }, function (data) {
            console.log(data);
            var destination = data.rideshares[0].Destination;
            var driver = data.rideshares[0].Driver[0].Driver;
            var rideshareNo = data.rideshares[0].RideshareNo;
            $('#passengerList').empty();
            $.each(data.rideshares[0].Passengers, function (key, val) {
                var item1 = $("<p/>", {
                    html: val.Passenger
                });
                item1.appendTo('#passengerList');

            });
            if (data.rideshares[0].Passengers.length == 0) {
                $('#passengerList').text('No Passengers');
            };

            var price = data.rideshares[0].Price;

            $('#rideshareNo').val(rideshareNo);
            $('#destination').text(destination);
            $('#driver').text(driver);
            $('#pricekm').text(price);
            $('#pricekmDialog').val(price);

            var isDriver = data.rideshares[0].isDriver;
            var isPartofRideshare = data.rideshares[0].isPartofRideshare;
            var openSeats = data.rideshares[0].OpenSeats;
            
            var filterType = $("#filterRideshareGroups").attr("data-filterType");
            console.log(isPartofRideshare);
            if(isPartofRideshare && isDriver)
            {
                $("#requestEditRoute").hide();
                $("#joinRideshare").hide();
                $("#changePetrolCost").show();
                
            }
            else if (isPartofRideshare && !isDriver)
            {
                $("#changePetrolCost").hide();
                $("#joinRideshare").hide();
                $("#requestEditRoute").show();
            }
            else if(!isPartofRideshare)
            {
                $("#requestEditRoute").hide();
                $("#changePetrolCost").hide();
                $("#joinRideshare").show();
            }
            if(openSeats==0)
            {
                $("#joinRideshare").hide();

            }
            else{
                $("#carFull").text("There are "+ openSeats +" open seats.");
            }
            
            
            
            
        });
    });
};

