let navigate = function(e) {
  var key=e.keyCode || e.which;
  if (key==13) {
    startProgram('', 'https://www.bing.com?q=' + $("#search__input").val());
    toggleStart();
  }
}

function esc(e) {
  var key=e.keyCode || e.which;
  if (key==27) {
    toggleStart();
  }
  desktopContextMenu(event.clientX, event.clientY, false);
}

function user(status) {
  switch (status) {
    case "logout":
      window.location.href = "login.html";
    case "lock":
      window.location.href = "login.html";
    case "sleep":
      window.location.href= "./Home/sys/screensaver.html?usr=" + $.urlParam('usr');
    default:
    console.log("status update failed...");
  }
}

function addApp() {
  alert("placeholder");  
}


$(window).load(function() {
  var $container = $('.start-screen');

  $container.masonry({
    itemSelector: '.masonry-item',
    columnWidth: 128
  });


  $('.start-menu').hide().css('opacity', 1);
});

$(function() {
  //$('.start-screen-scroll').jScrollPane();
});

function resizeStart() {
    var startWidth = $('.start-screen').outerWidth();
    var startRound = Math.ceil(startWidth / 128.0) * 128;

  console.log('original: ' + startWidth);
  console.log('rounded: ' + startRound);

    $('.start-screen').css({
      'width' : startRound
    });
}

//$(window).load(resizeStart);
//$(window).resize(resizeStart);



// Unfocus windows when desktop is clicked
$('.desktop').click(function(e) {
  if ( $('.desktop').has(e.target).length === 0 ) {
    $('.window').removeClass('window--active');
    $('.taskbar__item').removeClass('taskbar__item--active');
    desktopContextMenu(event.clientX, event.clientY, false);
  }
});





$(function() {
  $('.side__list ul').each(function() {
    if ( $(this).find('ul').is(':visible') ) {
      $(this).children('li').addClass('side__list--open');
    }
  });
});



$(function() {
  $('.side__list li').each(function() {
    if ( $(this).children('ul').length ) {
      //$(this).addClass('list__sublist');
      $(this).children('a').append('<span class="list__toggle"></span>');
    }

    if ( $(this).children('ul').is(':visible') ) {
      $(this).addClass('side__list--open');
    }
  });
});

$(document).on('click', '.list__toggle',  function() {

 $(this).closest('li').children('ul').animate({
  'height' : 'toggle',
  'opacity' : 'toggle'
}, 250);

 $(this).closest('li').toggleClass('side__list--open');
});




function toggleStart(e) {
  $('.start-menu-fade').fadeToggle(500);
  $('.start-menu').fadeToggle(250).toggleClass('start-menu--open');
  $('.taskbar__item--start').toggleClass('start--open');
  $('#search__input').val("");
  $('#search__input').focus();
}

$('.taskbar__item--start').click(toggleStart);
$('.start-menu__recent li a').click(toggleStart);
$('.start-screen__tile').click(toggleStart);

// Prevent "open" class on start
$(function() {
  $('.taskbar__item--start').click(function() {
    $(this).removeClass('taskbar__item--open taskbar__item--active');
  });
});


$(document).mouseup(function(e) {
    var start = $('.start-menu');
    var startToggle = $('.taskbar__item--start');


    if (start.is(':visible') && !startToggle.is(e.target) && startToggle.has(e.target).length === 0 && !start.is(e.target) && start.has(e.target).length === 0 ) {
      toggleStart();
      //alert('clicked outside start');
    }
});


// Current time
let getTime = () => {
  var a_p = "";
  var d = new Date();

  var curr_hour = d.getHours();
  if (curr_hour < 12) { a_p = "AM"; } else { a_p = "PM"; }

  // hours
  if (curr_hour == 0) {
    curr_hour = 12;
  }
  if (curr_hour > 12) {
    curr_hour = curr_hour - 12;
  }

  var curr_min = d.getMinutes();
  if ( curr_min < 10 ) {
    curr_min = '0' + curr_min;
  }

  $('#timeDisplay').html(curr_hour + ':' + curr_min + ' ' + a_p);
}

$.urlParam = function(name){
	var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
	return results[1] || 0;
}


$('.menu-toggle').each(function() {
  var menuName = $(this).data('menu');
  var menu = $('.menu[data-menu="' + menuName + '"]');
  var pos = $(this).position();
  var height = $(this).outerHeight();

  if ( !$(menu).hasClass('menu--bottom') ) {
    $(menu).position({
      my: 'left top',
      at: 'left bottom',
      of: this,
      collision: 'none'
    });
  } else {

  }

  $(menu).hide();

  $(this).click(function(e) {
    e.preventDefault();
    $('.menu').not(menu).hide();
    $(menu).toggle();
  });
});

let loadBackground = () => {
  try {
    $('#currentUser').text($.urlParam('usr'));
    document.getElementById('desktopBG').style.backgroundImage ="url('./Home/Pictures/backgrounds/" + Math.ceil(Math.random() * backgroundCount) + ".png')";
  }
  catch(err) {
    console.log(err);
  }
}
loadBackground();


$(document).mouseup(function(e) {
  if ( $('.menu').has(e.target).length === 0 && !$('.menu-toggle').is(e.target) && $('.menu-toggle').has(e.target).length === 0 ) {
    $('.menu').hide();
  }
});



/* LOOP */
var screensaverTimeout = 100; // seconds
function loop() {
  getTime();
  setTimeout(loop, 1000);
  screensaverTimeout -= 1;
  if (screensaverTimeout < 1) window.location.href= "./Home/NeonX/screensaver.html?usr=" + $.urlParam('usr');
}
loop();
