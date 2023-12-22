var screensaverTimeout = 900; // seconds
$.urlParam = function (name) {
    var results = new RegExp("[?&]" + name + "=([^&#]*)").exec(window.location.href);
    if (results == null) {
        return 0;
    }
    return results[1];
};
function desktop() {
    window.location.href = "../desktop.html?usr=" + $.urlParam("usr");
}
var c = document.getElementById("screen");
var ctx = c.getContext("2d");
c.height = window.innerHeight;
c.width = window.innerWidth;
ctx.fillStyle = "rgb(0, 0, 30)";
ctx.fillRect(0, 0, c.width, c.height);
var payload = "абвгдеёжзийклмнопрстуфхцчщъыэюя   ";
chinese = payload.split("");
var fontSize = 10;
var columns = c.width / fontSize;
var drops = [];
for (var i = 0; i < columns; i++) {
    drops[i] = 1;
}
function draw() {
    ctx.fillStyle = "rgba(0, 0, 20, 0.05)";
    ctx.fillRect(0, 0, c.width, c.height);
    var rn = Math.floor(Math.random() * 255);
    ctx.fillStyle = "rgb(0," + rn + 20 + "," + rn + 90 + ")";
    ctx.font = fontSize + "px sans-serif";
    for (var i = 0; i < drops.length; i++) {
        var text = payload[Math.floor(Math.random() * payload.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > c.height && Math.random() > 0.975) {
            drops[i] = 0;
        }
        //incrementing Y coordinate
        drops[i]++;
    }
}
setInterval(draw, 60);
var doc = $(document), mX, mY, letter = [];
var letters = chinese;
mR = function (n, i) { return Math.floor(Math.random() * n) + i; };
inject = function () {
    can = document.querySelector(".trail");
    con = can.getContext("2d");
    init();
};
size = function () {
    can.height = doc.height();
    can.width = doc.width();
};
$(window).on("resize", function () {
    size();
});
init = function () {
    size();
    think();
};
doc.on("mousemove", function (e) {
    mX = e.pageX;
    mY = e.pageY;
    letter.push([
        mX - 10 + mR(20, 0),
        mY + mR(20, 0),
        letters[mR(letters.length, 0)],
        mR(10, 8),
        1,
        mR(6, 1),
        mR(20, 0),
    ]);
});
dT = function (x, y, t, s, c) {
    con.save();
    con.font = "" + s + "px Lucida Console";
    con.shadowColor = "rgba(0,180,255," + c + ")";
    con.shadowBlur = s / 2;
    con.fillStyle = "rgba(0,200,140," + c + ")";
    var tW = con.measureText(t).width;
    con.fillText(t, x - tW / 2, can.height - y);
    con.restore();
};
dR = function (x, y, w, h, c) {
    con.save();
    con.beginPath();
    con.rect(x, y, w, h);
    con.fillStyle = c;
    con.fill();
    con.restore();
};
think = function () {
    var sC = mR(2, 1);
    for (var i = 0; i < letter.length; i++) {
        sC == 2
            ? letter
                ? (letter[i][2] = letters[mR(letters.length, 0)])
                : null
            : null;
        letter ? (letter[i][1] -= letter[i][5]) : null;
        letter[i][4] >= 0 ? (letter[i][4] -= 0.01) : letter.splice(i, 1);
    }
    animate();
    window.requestAnimationFrame(think);
};
animate = function () {
    con.clearRect(0, 0, can.width, can.height);
    for (var i = 0; i < letter.length; i++) {
        dT(letter[i][0], letter[i][1], letter[i][2], letter[i][3], letter[i][4]);
        var rH = mR(540, 10);
        var sH = mR(rH, 1);
        letter[i][6] == 2
            ? dR(letter[i][0], letter[i][1] - sH, letter[i][3] / 1.5, rH, "rgba(0,255,100, 0.05)")
            : null;
    }
};
doc.ready(function () { return inject(); });
function loop() {
    setTimeout(loop, 1000);
    screensaverTimeout -= 1;
    console.clear();
    if (screensaverTimeout < 1)
        window.location.href = "../login.html";
}
loop();
