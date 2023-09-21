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
    key.classList.add("playing", "animated", "heartBeat");
    setTimeout(() => {
      key.classList.remove("playing", "animated", "heartBeat");
    }, 210);
  };

  return (
    <div className="App">
      <main className="min-h-screen flex flex-col">
        <header className="bg-black p-4 shadow-sm">
          <div className="container mx-auto">
            <h1 className="text-8xl text-white text-center mt-4 mb-8 font-bold">
              {GREETING}
              <span role="img" aria-label="music notes">
                👋
              </span>
            </h1>

            <div className="introduction">
              <p className="text-3xl text-white text-center">
                <span role="img" aria-label="wave"></span>
                My name is {AUTHOR}, and this is my React drum kit!
                <span role="img" aria-label="cool">
                  🥁
                </span>
              </p>
            </div>
          </div>
        </header>
        <section id="drumkit" className="flex-1 bg-black">
          <div className="container mx-auto my-12">
            <div className="keys">{keys}</div>
            {sounds}
          </div>
          <div className="instructions">
            <p className="text-2xl text-center text-white font-mono">
              You can play the drum sounds by pressing the corresponding key, or
              by clicking on the button.
            </p>
            <div className="text-white text-center uppercase pb-4">
              <span>
                <a
                  href="https://github.com/anthonycoffey/JavaScript30_ReactDrumKit_01"
                  rel="noopener noreferrer"
                  target="_blank"
                  className="mt-2 block text-blue-600 font-mono text-2xl"
                >
                  (show me the code)
                </a>
              </span>
            </div>
          </div>
        </section>
        <section id="changelog" className="bg-black p-4 shadow-sm flex-1">
          <div className="container mx-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Date
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Version
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Change
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">2023-09-21</td>
                  <td className="px-6 py-4 whitespace-nowrap">1.1.1</td>
                  <td className="px-6 py-4">
                    implemented TailwindCSS and reworked layout for responsive
                    design and cleanup of markup and stylesheet
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">2023-09-15</td>
                  <td className="px-6 py-4 whitespace-nowrap">1.1.0</td>
                  <td className="px-6 py-4">updated for react v18</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">2019-06-28</td>
                  <td className="px-6 py-4 whitespace-nowrap">1.0.0</td>
                  <td className="px-6 py-4">Initial release</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
        <footer className="bg-black text-white py-4">
          <div className="container mx-auto text-center">
            <p className="uppercase font-mono text-xl mb-2">
              want to get in touch?
            </p>

            <a
              className="bg-white px-20 py-5 text-black uppercase font-bold inline-block"
              href="https://linktr.ee/coffeycodes"
              rel="noopener noreferrer"
              target="_blank"
            >
              Click Here
            </a>
          </div>
        </footer>
      </main>
    </div>
  );
}

export default App;
