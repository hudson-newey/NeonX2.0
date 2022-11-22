$.urlParam = function(name){
	let results = new RegExp('[?&]' + name + '=([^&#]*)').exec(window.location.href)
	return results[1] || 0
}

let desktop = function () {
	window.location.href = '../desktop.html?usr=' + $.urlParam('usr')
}

let c = document.getElementById("screen")
let ctx = c.getContext("2d")

c.height = window.innerHeight
c.width = window.innerWidth

ctx.fillStyle = "rgb(0, 0, 30)"
	ctx.fillRect(0, 0, c.width, c.height)

const payload: string = "абвгдеёжзийклмнопрстуфхцчщъыэюя   "
chinese = payload.split("")

let font_size: number = 10
let columns: number = c.width/font_size
let drops: Array<> = []
for(let x = 0; x < columns; x++)
	drops[x] = 1

function draw()
{
	ctx.fillStyle = "rgba(0, 0, 20, 0.05)"
	ctx.fillRect(0, 0, c.width, c.height)
	let rn = Math.floor(Math.random() * 255)
	ctx.fillStyle = "rgb(0,"+ rn+20 +"," + rn+90 + ")"
	ctx.font = font_size + "px sans-serif"
	for(let i = 0; i < drops.length; i++)
	{

		let text = payload[Math.floor(Math.random()*payload.length)]

		ctx.fillText(text, i*font_size, drops[i]*font_size)

		if(drops[i]*font_size > c.height && Math.random() > 0.975)
			drops[i] = 0

		//incrementing Y coordinate
		drops[i]++
	}
}

setInterval(draw, 60)



let doc = $(document), mX, mY, letter = []
let letters = chinese

mR = (n, i) => Math.floor(Math.random() * n) + i

inject = () => {
  can = document.querySelector(".trail")
  con = can.getContext("2d")
  init()
}

size = () => {
  can.height = doc.height()
  can.width = doc.width()
}

$(window).on("resize", () => { size() })

init = () => {
  size()
  think()
}

doc.on("mousemove", (e) => {
  mX = e.pageX
  mY = e.pageY
  letter.push([mX-10+mR(20, 0), mY+mR(20,0), letters[mR(letters.length, 0)], mR(10, 8), 1, mR(6, 1), mR(20, 0)])
})

dT = (x, y, t, s, c) => {
  con.save()
  con.font = ""+s+"px Lucida Console"
  con.shadowColor = "rgba(0,180,255,"+c+")"
  con.shadowBlur = s/2
  con.fillStyle = "rgba(0,200,140,"+c+")"
  let tW = con.measureText(t).width
  con.fillText(t, x-tW/2, can.height-y)
  con.restore()
}

dR = (x, y, w, h, c) => {
  con.save()
  con.beginPath()
  con.rect(x, y, w, h)
  con.fillStyle = c
  con.fill()
  con.restore()
}

think = () => {
  let sC = mR(2, 1)
  for (let i = 0; i < letter.length; i++) {
    sC == 2 ? letter ? letter[i][2] = letters[mR(letters.length, 0)]: null:null
    letter ? letter[i][1]-= letter[i][5]: null
    letter[i][4] >= 0 ? letter[i][4]-= 0.01: letter.splice(i, 1)
  }
  animate()
  window.requestAnimationFrame(think)
}

animate = () => {
  con.clearRect(0, 0, can.width, can.height)
  for (let i = 0; i < letter.length; i++) {
    dT(letter[i][0], letter[i][1], letter[i][2], letter[i][3], letter[i][4])
    let rH = mR(540, 10)
    let sH = mR(rH, 1)
    letter[i][6] == 2 ? dR(letter[i][0], letter[i][1]-sH, letter[i][3]/1.5, rH, "rgba(0,255,100, 0.05)"): null
  }

}

doc.ready(() => inject())



/* complete lockout */
let screensaverTimeout: number = 900 // 15 minutes
function loop(): void {
  setTimeout(loop, 1000)
  screensaverTimeout -= 1

	console.clear()
  console.log(screensaverTimeout)
  if (screensaverTimeout < 1) window.location.href= "../login.html"
}
loop()
