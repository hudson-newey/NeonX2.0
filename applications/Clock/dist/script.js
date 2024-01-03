window.onload = function () {
    var timeOutputElement = document.getElementById("timeOutlet");
    if (!timeOutputElement)
        return;
    var updateTime = function () {
        var time = new Date();
        // TODO: remove this hacky typing
        var hours = time.getHours();
        var minutes = time.getMinutes();
        var seconds = time.getSeconds();
        if (hours < 10)
            hours = hours.toString().padStart(2, "0");
        if (minutes < 10)
            minutes = minutes.toString().padStart(2, "0");
        if (seconds < 10)
            seconds = seconds.toString().padStart(2, "0");
        timeOutputElement.innerHTML = hours + ":" + minutes + ":" + seconds;
    };
    setTimeout(function () {
        updateTime();
        setInterval(updateTime, 1000);
    });
};
