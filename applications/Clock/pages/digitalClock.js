const digitalClockPage = new Component({
  title: "Digital Clock",
  template: ``,
});

const updateTime = () => {
  const time = new Date();

  let hours = time.getHours();
  let minutes = time.getMinutes();
  let seconds = time.getSeconds();

  if (hours < 10) hours = hours.toString().padStart(2, "0");
  if (minutes < 10) minutes = minutes.toString().padStart(2, "0");
  if (seconds < 10) seconds = seconds.toString().padStart(2, "0");

  const formattedTime = `${hours}:${minutes}:${seconds}`;
  digitalClockPage.template = formattedTime;
};

updateTime();
setInterval(updateTime, 1000);
