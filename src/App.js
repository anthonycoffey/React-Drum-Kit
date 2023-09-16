import React, { useState, useEffect } from "react";
import "./App.sass";
import wavs from "./sounds.js";

function App() {
  const GREETING = "Hey Y'all!";
  const AUTHOR = "Anthony Coffey";
  const [sounds, setSounds] = useState([]);
  const [keys, setKeys] = useState([]);

  useEffect(() => {
    // audio elements
    const sounds = wavs.map((sound, index) => (
      <audio
        data-key={sound.key}
        src={`${process.env.PUBLIC_URL}/sounds/${sound.file}`}
        key={index}
      ></audio>
    ));

    const keys = wavs.map((sound, index) => (
      <div className="key-wrapper" key={index}>
        <kbd
          className="key"
          data-key={sound.key}
          onClick={() => playSound(sound.key)}
        >
          {sound.key}
        </kbd>
        <span className="sound">{sound.file.replace(".wav", "")}</span>
      </div>
    ));

    setSounds(sounds);
    setKeys(keys);

    const handleKeyDown = (e) => {
      if (e.key) {
        playSound(e.key);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const playSound = (k) => {
    const audio = document.querySelector(`audio[data-key="${k}"]`);
    const key = document.querySelector(`kbd[data-key="${k}"]`);
    if (!audio) return;
    audio.currentTime = 0;
    audio.play();
    console.log("bet its here");
    key.classList.add("playing", "animated", "heartBeat");
    setTimeout(() => {
      key.classList.remove("playing", "animated", "heartBeat");
    }, 210);
  };

  return (
    <div className="App">
      <header>
        <div className="project"></div>
      </header>
      <main>
        <h1 className="greeting">
          {GREETING}
          <span role="img" aria-label="music notes">
            👋
          </span>
        </h1>

        <div className="introduction">
          <p>
            <span role="img" aria-label="wave"></span>
            My name is {AUTHOR}, and this is my React drum kit!
            <span role="img" aria-label="cool">
              🥁
            </span>
          </p>
        </div>

        <div className="keys">{keys}</div>

        <div className="instructions">
          <p>
            You can play the drum sounds by pressing the corresponding key, or
            by clicking on the button.
          </p>
        </div>
        <small>
          <span>
            (show me the{" "}
            <a
              href="https://github.com/anthonycoffey/JavaScript30_ReactDrumKit_01"
              rel="noopener noreferrer"
              target="_blank"
            >
              code
            </a>
            )
          </span>
        </small>
        {sounds}
        <hr />
        <table className="changelog-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Version</th>
              <th>Change</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>2023-09-15</td>
              <td>1.1.0</td>
              <td>updated for react v18</td>
            </tr>
            <tr>
              <td>2019-06-28</td>
              <td>1.0.0</td>
              <td>Initial release</td>
            </tr>
          </tbody>
        </table>
      </main>
      <footer>
        <span className="pre-follow">want to get in touch?</span>
        <span className="follow-me">
          <a
            href="https://linktr.ee/coffeycodes"
            rel="noopener noreferrer"
            target="_blank"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="1em"
              viewBox="0 0 448 512"
            >
              <path d="M210.6 5.9L62 169.4c-3.9 4.2-6 9.8-6 15.5C56 197.7 66.3 208 79.1 208H104L30.6 281.4c-4.2 4.2-6.6 10-6.6 16C24 309.9 34.1 320 46.6 320H80L5.4 409.5C1.9 413.7 0 419 0 424.5c0 13 10.5 23.5 23.5 23.5H192v32c0 17.7 14.3 32 32 32s32-14.3 32-32V448H424.5c13 0 23.5-10.5 23.5-23.5c0-5.5-1.9-10.8-5.4-15L368 320h33.4c12.5 0 22.6-10.1 22.6-22.6c0-6-2.4-11.8-6.6-16L344 208h24.9c12.7 0 23.1-10.3 23.1-23.1c0-5.7-2.1-11.3-6-15.5L237.4 5.9C234 2.1 229.1 0 224 0s-10 2.1-13.4 5.9z" />
            </svg>
            Visit My Linktr.ee
          </a>
        </span>
      </footer>
    </div>
  );
}

export default App;
