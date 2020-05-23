let navigate = function(e: any): void {
  let key: number = e.keyCode || e.which
  if (key==13) {
    if ($("#search__input").val().includes("://")) {
      startProgram('', $("#search__input").val())
    } else {
      startProgram('', 'https://www.bing.com?q=' + $("#search__input").val())
    }
    toggleStart()
  }
}

function esc(e: any): void {
  let key: number = e.keyCode || e.which
  if (key==27) {
    toggleStart()
  }
  desktopContextMenu(event.clientX, event.clientY, false)
}

function user(status: string): void {
  switch (status) {
    case "logout":
      window.location.href = "./login.html"
      break
    case "lock":
      window.location.href = "./login.html"
      break
    case "sleep":
      window.location.href= "./NeonX/screensaver.html?usr=" + $.urlParam('usr')
      break
    default:
      console.log("status update failed...")
  }
}

$(window).load(function() {
  let $container: object = $('.start-screen')

  $container.masonry({
    itemSelector: '.masonry-item',
    columnWidth: 128
  })


  $('.start-menu').hide().css('opacity', 1)
})

$(function() {
  //$('.start-screen-scroll').jScrollPane();
})

function resizeStart(): void {
    let startWidth: number = $('.start-screen').outerWidth()
    let startRound: number = Math.ceil(startWidth / 128.0) * 128

  console.log('original: ' + startWidth)
  console.log('rounded: ' + startRound)

    $('.start-screen').css({
      'width' : startRound
    })
}



// Unfocus windows when desktop is clicked
$('.desktop').click(function(e: any) {
  if ($('.desktop').has(e.target).length === 0) {
    desktopContextMenu(event.clientX, event.clientY, false)
  }
})




function toggleStart(e: any): void {
  $('.start-menu-fade').fadeToggle(500)
  $('.start-menu').fadeToggle(250).toggleClass('start-menu--open')
  $('.taskbar__item--start').toggleClass('start--open')
  $('#search__input').val("")
  $('#search__input').focus()
}

$('.taskbar__item--start').click(toggleStart)
$('.start-menu__recent li a').click(toggleStart)
$('.start-screen__tile').click(toggleStart)

// Prevent "open" class on start
$(function() {
  $('.taskbar__item--start').click(function() {
    $(this).removeClass('taskbar__item--open taskbar__item--active')
  })
})


// Current time
let getTime = () => {
  let a_p: string = ""
  let d = new Date()

  let curr_hour: number = d.getHours()
  if (curr_hour < 12) { a_p = "AM" } else { a_p = "PM" }

  // hours
  if (curr_hour == 0) {
    curr_hour = 12
  }
  if (curr_hour > 12) {
    curr_hour = curr_hour - 12
  }

  let curr_min: number = d.getMinutes()
  if ( curr_min < 10 ) {
    curr_min = '0' + curr_min.toString()
  }

  $('#timeDisplay').html(curr_hour.toString() + ':' + curr_min.toString() + ' ' + a_p)
}

$.urlParam = function(name: string) {
	let results: string = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href)
	return results[1] || 0
}

$('.menu-toggle').each(function() {
  let menuName = $(this).data('menu')
  let menu = $('.menu[data-menu="' + menuName + '"]')
  let pos = $(this).position()
  let height = $(this).outerHeight()

  if ( !$(menu).hasClass('menu--bottom') ) {
    $(menu).position({
      my: 'left top',
      at: 'left bottom',
      of: this,
      collision: 'none'
    })
  } else {
    // menu hide?
  }

  $(menu).hide()

  $(this).click(function(e) {
    e.preventDefault()
    $('.menu').not(menu).hide()
    $(menu).toggle()
  })
})

let loadBackground = () => {
  try {
    $('#currentUser').text($.urlParam('usr'))
    document.getElementById('desktopBG').style.backgroundImage ="url('./NeonX/backgrounds/" + Math.ceil(Math.random() * backgroundCount) + ".png')"
  }
  catch(err) {
    console.log(err)
  }
}
loadBackground()


$(document).mouseup(function(e) {
  if ( $('.menu').has(e.target).length === 0 && !$('.menu-toggle').is(e.target) && $('.menu-toggle').has(e.target).length === 0 ) {
    $('.menu').hide()
  }
})



/* LOOP */
let screensaverTimeout: number = 480 // seconds (8) miniutes default
function loop(): void {
  getTime()
  setTimeout(loop, 1000)
  screensaverTimeout -= 1
  if (screensaverTimeout < 1) window.location.href = "./NeonX/screensaver.html?usr=" + $.urlParam('usr')
}
loop()
