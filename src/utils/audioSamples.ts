
import { Howl } from 'howler';

// Define the audio samples for our drum machine with Howler for better audio handling
const isProduction = process.env.NODE_ENV === 'production';
const basePath = isProduction ? '/React-Drum-Kit' : '';

export const audioSamples = {
  kick: new Howl({
    src: [`${basePath}/sounds/kick.wav`],
    volume: 1.0,
    preload: true,
    html5: false // Use Web Audio API instead of HTML5 Audio for better performance
  }),
  snare: new Howl({
    src: [`${basePath}/sounds/snare.wav`],
    volume: 1.0,
    preload: true,
    html5: false
  }),
  hihat: new Howl({
    src: [`${basePath}/sounds/hihat.wav`],
    volume: 1.0,
    preload: true,
    html5: false
  }),
  clap: new Howl({
    src: [`${basePath}/sounds/clap.wav`],
    volume: 1.0,
    preload: true,
    html5: false
  })
};

// Function to play a specific sample with volume control
export const playSample = (sampleName: 'kick' | 'snare' | 'hihat' | 'clap', volume = 0.8) => {
  const sound = audioSamples[sampleName];
  if (sound) {
    console.log(`Playing ${sampleName} at volume ${volume}`);
    sound.volume(volume);
    sound.play();
  } else {
    console.error(`Sound ${sampleName} not found`);
  }
};

// Define track names and their corresponding sample names
export const trackConfig = [
  { id: 0, name: "Kick", sample: "kick", color: "bg-retro-orange" },
  { id: 1, name: "Snare", sample: "snare", color: "bg-retro-pink" },
  { id: 2, name: "Hi-hat", sample: "hihat", color: "bg-retro-cyan" },
  { id: 3, name: "Clap", sample: "clap", color: "bg-retro-purple" }
];

// Test function to check if all sounds are loading properly
export const testAllSounds = () => {
  console.log("Testing all sounds...");
  Object.keys(audioSamples).forEach(key => {
    console.log(`Testing sound: ${key}`);
    playSample(key as any, 0.5);
  });
};
