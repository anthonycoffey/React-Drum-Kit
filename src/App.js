import React from 'react';
import './App.css';
import wavs from './sounds.js'
function App() {
  const title = 'React Drum Kit!'

  const sounds = []
  for(const [index, sound] of wavs.entries()){
    sounds.push(<audio controls data-key={sound.key} src={`/sounds/${sound.file}`} key={index}></audio>)
  }

  window.addEventListener('keydown', function(e){
    if(e.key){
      const audio = document.querySelector(`audio[data-key="${e.key}"`);
      if(!audio) return;

      audio.play()
    }
  })

  return (
    <div className="App">
      <header className="App-header">
        <h1>{title}</h1>
          { sounds }
      </header>
      <main>

      </main>
    </div>
  );
}

export default App;
