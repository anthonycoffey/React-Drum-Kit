import React from 'react';
import './App.scss';
import '@fortawesome/fontawesome-free/css/fontawesome.min.css'
import '@fortawesome/fontawesome-free/css/brands.min.css'
import wavs from './sounds.js'

class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      title: `React Drum Kit!`,
      hashtag: '#JavaScript30',
      project: 'Drum Kit 01',
      author: 'Anthony Coffey',
      sounds: [],
      keys: [],
      allKeys: []
    };

    // audio elements
    for(const [index, sound] of wavs.entries()) {
      this.state.sounds.push(<audio data-key={sound.key} src={`sounds/${sound.file}`} key={index}></audio>)
    }

    // buttons / key elements
    for(const [index, sound] of wavs.entries()) {
      this.state.keys.push(<div className="key-wrapper" key={index}>
        <kbd className="key" data-key={sound.key}
                            onClick={(e) => this.playSound(sound.key)}>{sound.key}</kbd>
        <span className="sound">{sound.file.replace('.wav', '')}</span>
      </div>)
    }

    window.addEventListener('keydown', (e) => {
      if(e.key) {
        this.playSound(e.key);
      }
    })
  }

  playSound(k) {
    const audio = document.querySelector(`audio[data-key="${k}"`);
    const key = document.querySelector(`kbd[data-key="${k}"]`);
    if(!audio) return;
    audio.currentTime = 0;
    console.log(audio)
    audio.play();
    key.classList.add('playing','animated','heartBeat');
    setTimeout(function(){
      key.classList.remove('playing','animated','heartBeat')
    }, 210)
  }

  render() {
    return (<div className="App">
      <header>
        <div className="hashtag">
          {this.state.hashtag}
        </div>
        <div className="project">
          {this.state.project}
        </div>
      </header>
      <main>
        <h1><span role="img" aria-label="music notes">🎶</span>{this.state.title}<span role="img" aria-label="music notes">🎶</span></h1>

        <div className="introduction">
          <p><span role="img" aria-label="wave">👋</span> Hello! My name is Anthony Coffey, and I was inspired to take the <a href="https://javascript30.com/" rel="noopener noreferrer" target="_blank">#JavaScript30</a> challenge so I built a drum kit using React. <span role="img" aria-label="cool">😎</span></p>
        </div>

        <div className="keys">
          {this.state.keys}
        </div>

        <div className="instructions">
          <p>You can play the drum sounds by pressing the corresponding key, or by clicking on the button.</p>

        </div>
        <small><span>(show me the <a href="https://github.com/anthonycoffey/JavaScript30_ReactDrumKit_01" rel="noopener noreferrer" target="_blank">code</a>)</span></small>
        {this.state.sounds}
      </main>
      <footer>
        <span className="follow-me">Follow Me</span>
        <ul>
          <li>
            <i className="fab fa-github-square"></i><a href="https://github.com/anthonycoffey" rel="noopener noreferrer" target="_blank">Github</a>
          </li>
          <li>
            <i className="fab fa-twitter-square"></i><a href="https://twitter.com/CoffeyWebDev" rel="noopener noreferrer" target="_blank">Twitter</a>
          </li>
          <li>
            <i className="fab fa-facebook-square"></i><a href="https://www.facebook.com/coffeyweb/" rel="noopener noreferrer" target="_blank">Facebook</a>
          </li>
          <li>
            <i className="fab fa-linkedin"></i><a href="https://linkedin.com/in/coffeyanthony" rel="noopener noreferrer" target="_blank">LinkedIn</a>
          </li>
        </ul>
      </footer>
    </div>)
  };
}

export default App;
