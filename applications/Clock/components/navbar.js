const navbarComponent = new Component({
  navbar: `
        <nav>
            <ul>
                <li>
                    <a onclick="app.pageTemplate = digitalClockPage">Digital Clock</a>
                </li>

                <li>
                    <a onclick="app.pageTemplate = stopwatchPage">Stopwatch</a>
                </li>

                <li>
                    <a onclick="app.pageTemplate = timerPage">Timer</a>
                </li>

                <li>
                    <a onclick="app.pageTemplate = worldClockPage">World Clock</a>
                </li>
            </ul>
        </nav>

        <style>
            li {
                cursor: pointer;

                &:hover {
                    text-decoration: underline;
                }
            }
        </style>
    `,
});
