// $(function () {
//     /* BOOTSNIPP FULLSCREEN FIX */
//     if (window.location == window.parent.location) {
//         $('#back-to-bootsnipp').removeClass('hide');
//     }
    
    
//     $('[data-toggle="tooltip"]').tooltip();
    
//     $('#fullscreen').on('click', function(event) {
//         event.preventDefault();
//         window.parent.location = "http://bootsnipp.com/iframe/4l0k2";
//     });
//     $('a[href="#cant-do-all-the-work-for-you"]').on('click', function(event) {
//         event.preventDefault();
//         $('#cant-do-all-the-work-for-you').modal('show');
//     })
    
//     $('[data-command="toggle-search"]').on('click', function(event) {
//         event.preventDefault();
//         $(this).toggleClass('hide-search');
        
//         if ($(this).hasClass('hide-search')) {        
//             $('.c-search').closest('.row').slideUp(100);
//         }else{   
//             $('.c-search').closest('.row').slideDown(100);
//         }
//     })
    
//     $('#contact-list').searchable({
//         searchField: '#contact-list-search',
//         selector: 'li',
//         childSelector: '.col-xs-12',
//         show: function( elem ) {
//             elem.slideDown(100);
//         },
//         hide: function( elem ) {
//             elem.slideUp( 100 );
//         }
//     })
// });

//......................................................................................................................

$('#details').hide()

var JSON
var Username
var Name
var Surname

$.getJSON('/blocked', {}, function (data) {
  console.log('posting')
  JSON = data
  $.each(data.users, createItem)
})

var createItem = function (key, val) { // creates item, appends to list, makes clickable, loads required info from json
  var item = $('<a/>', {
    'class': 'list-group-item',
    'id': val.Username,
    'href': '#',
    html: val.Username + ': ' + val.Name + ' ' + val.Surname
  })
  item.appendTo('#blockedUserList')
  item.click(function () {
          Username = val.Username
          Name = val.Name
          Surname = val.Surname
          $('#unblockUserHeading').text(Name + " " + Surname)
    $('#details').show()
  })
}

$('#unblockUserButton').click(function () {
  $.post("/unblockUser", Username, {}, String)    //need logan to verify, dont want to delete my only test entry XD
  $('#' + Username).remove()
  console.log(Username)
})
