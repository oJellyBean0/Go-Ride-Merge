    $("#modalDelete").on("show", function() {    // wire up the OK button to dismiss the modal when shown
        $("#modalDelete a.btn").on("click", function(e) {
            console.log("button pressed");   // just as an example...
            $("#modalDelete").modal('hide');     // dismiss the dialog
        });
    });
    $("#modalDelete").on("hide", function() {    // remove the event listeners when the dialog is dismissed
        $("#modalDelete a.btn").off("click");
    });
    
    $("#modalDelete").on("hidden", function() {  // remove the actual elements from the DOM when fully hidden
        $("#modalDelete").remove();
    });
    
    $("#modalDelete").modal({                    // wire up the actual modal functionality and show the dialog
      "backdrop"  : "static",
      "keyboard"  : true,
      "show"      : true                     // ensure the modal is shown immediately
    });