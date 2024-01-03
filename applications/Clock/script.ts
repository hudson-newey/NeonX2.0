window.onload = () => {
    const timeOutputElement = document.getElementById("timeOutlet");

    if (!timeOutputElement) return;

    const updateTime = () => {
        const time = new Date();

        // TODO: remove this hacky typing
        let hours: string | number = time.getHours();
        let minutes: string | number = time.getMinutes();
        let seconds: string | number = time.getSeconds();

        if (hours < 10) hours = hours.toString().padStart(2, "0");
        if (minutes < 10) minutes = minutes.toString().padStart(2, "0");
        if (seconds < 10) seconds = seconds.toString().padStart(2, "0");

        timeOutputElement.innerHTML = `${hours}:${minutes}:${seconds}`;
    };

    setTimeout(() => {
        updateTime();
        setInterval(updateTime, 1000);
    });
};
