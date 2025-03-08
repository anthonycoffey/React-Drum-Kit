import React, { useState, useEffect, useRef, useCallback } from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import DrumPad from "@/components/DrumPad";
import { Play, Pause, Save, Trash2, VolumeX, Volume2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { playSample, trackConfig } from "@/utils/audioSamples";

const Index = () => {
  const { toast } = useToast();
  const [playing, setPlaying] = useState(false);
  const [bpm, setBpm] = useState(120);
  const [currentStep, setCurrentStep] = useState(-1);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(80);
  const [tapeEffect, setTapeEffect] = useState(false);
  const [reverbEffect, setReverbEffect] = useState(false);
  const playStartedRef = useRef(false);

  // Create a 2D array for our sequence (tracks × steps)
  const [sequence, setSequence] = useState<boolean[][]>(
    Array(trackConfig.length)
      .fill(0)
      .map(() => Array(16).fill(false))
  );

  // Reference to store the interval ID for clearing later
  const sequencerIntervalRef = useRef<number | null>(null);

  // Calculate step duration in milliseconds
  const stepDuration = 60000 / bpm / 4; // 16th notes

  // Handle toggling a pad on/off
  const togglePad = (trackIndex: number, stepIndex: number) => {
    const newSequence = [...sequence];
    newSequence[trackIndex][stepIndex] = !newSequence[trackIndex][stepIndex];
    setSequence(newSequence);

    // Play the sound when toggling on
    if (newSequence[trackIndex][stepIndex] && !muted) {
      playSample(trackConfig[trackIndex].sample as any, volume / 100);
    }
  };

  // Start/stop the sequencer
  const togglePlayback = useCallback(() => {
    setPlaying((prevPlaying) => !prevPlaying);
    playStartedRef.current = false; // Reset the ref when toggling playback
  }, []);

  // Reset and stop the sequencer
  const stopSequencer = useCallback(() => {
    setPlaying(false);
    setCurrentStep(-1);
    playStartedRef.current = false;
    if (sequencerIntervalRef.current !== null) {
      window.clearInterval(sequencerIntervalRef.current);
      sequencerIntervalRef.current = null;
    }
  }, []);

  // Handle sequencer playback
  useEffect(() => {
    if (playing) {
      // Reset the step counter if it was stopped
      if (currentStep === -1) setCurrentStep(0);

      // Only show toast notification once when starting playback
      if (!playStartedRef.current) {
        toast({
          title: "Sequence started",
          description: "Your beat is now playing",
          duration: 3000,
        });
        playStartedRef.current = true;
      }

      // Set up the interval for playback
      sequencerIntervalRef.current = window.setInterval(() => {
        setCurrentStep((prevStep) => {
          const nextStep = (prevStep + 1) % 16;

          // Play all sounds for this step
          if (!muted) {
            sequence.forEach((track, trackIndex) => {
              if (track[nextStep]) {
                console.log(`Playing sound: ${trackConfig[trackIndex].sample}`);
                playSample(trackConfig[trackIndex].sample as any, volume / 100);
              }
            });
          }

          return nextStep;
        });
      }, stepDuration);
    } else {
      // Clear the interval when stopped
      if (sequencerIntervalRef.current !== null) {
        window.clearInterval(sequencerIntervalRef.current);
        sequencerIntervalRef.current = null;

        // Only show toast if it was previously playing
        if (playStartedRef.current) {
          toast({
            title: "Sequence stopped",
            description: "Your beat has been stopped",
            duration: 3000,
          });
          playStartedRef.current = false;
        }
      }
    }

    // Clean up on unmount
    return () => {
      if (sequencerIntervalRef.current !== null) {
        window.clearInterval(sequencerIntervalRef.current);
      }
    };
  }, [playing, stepDuration, toast, sequence, muted, volume]); // Need to include sequence, muted and volume to properly trigger sounds

  // Update interval when BPM changes while playing
  useEffect(() => {
    if (playing && sequencerIntervalRef.current !== null) {
      window.clearInterval(sequencerIntervalRef.current);
      sequencerIntervalRef.current = window.setInterval(() => {
        setCurrentStep((prevStep) => {
          const nextStep = (prevStep + 1) % 16;

          // Play all sounds for this step
          if (!muted) {
            sequence.forEach((track, trackIndex) => {
              if (track[nextStep]) {
                playSample(trackConfig[trackIndex].sample as any, volume / 100);
              }
            });
          }

          return nextStep;
        });
      }, stepDuration);
    }
  }, [bpm, playing]);

  const toggleMute = () => {
    setMuted(!muted);
    toast({
      title: !muted ? "Sound muted" : "Sound unmuted",
      description: !muted ? "Output is now muted" : "Output is now audible",
      duration: 3000,
    });
  };

  const clearPattern = () => {
    setSequence(
      Array(trackConfig.length)
        .fill(0)
        .map(() => Array(16).fill(false))
    );
    toast({
      title: "Pattern cleared",
      description: "Your sequence has been reset",
    });
  };

  const savePattern = () => {
    // In a real application, this would save the pattern
    toast({
      title: "Pattern saved",
      description: "Your sequence has been saved",
      duration: 3000,
    });
  };

  // Add a predefined pattern for demonstration
  const loadDemoPattern = () => {
    const demoPattern = [
      [
        true,
        false,
        false,
        false,
        true,
        false,
        false,
        false,
        true,
        false,
        false,
        false,
        true,
        false,
        false,
        false,
      ], // Kick
      [
        false,
        false,
        false,
        false,
        true,
        false,
        false,
        false,
        false,
        false,
        true,
        false,
        true,
        false,
        false,
        false,
      ], // Snare
      [
        true,
        false,
        true,
        false,
        true,
        false,
        true,
        false,
        true,
        false,
        true,
        false,
        true,
        false,
        true,
        false,
      ], // Hi-hat
      [
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        true,
        false,
        false,
        false,
        false,
        false,
        false,
        true,
      ], // Clap
    ];
    setSequence(demoPattern);
    toast({
      title: "Demo pattern loaded",
      description: "Try playing this pattern",
      duration: 3000,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-zinc-950 text-amber-50 overflow-hidden">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="retro-container p-6 rounded-lg border-4 border-zinc-700 bg-zinc-800 shadow-[0_0_15px_rgba(0,0,0,0.7)] relative overflow-hidden">
          {/* Vintage Overlay Effects */}
          <div className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-b from-zinc-900/10 to-zinc-900/40 mix-blend-overlay pointer-events-none z-10"></div>
          <div className="absolute top-0 left-0 right-0 bottom-0 bg-[radial-gradient(circle_at_center,_transparent_40%,_rgba(0,0,0,0.4)_100%)] mix-blend-overlay pointer-events-none z-10"></div>

          {/* Wood panel effect */}
          <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,#3a2714,#3a2714_10px,#2d1e10_10px,#2d1e10_20px)] opacity-5 mix-blend-multiply pointer-events-none"></div>

          <header className="text-center mb-8 relative">
            <h1 className="text-4xl md:text-5xl font-bold mb-2 tracking-wider text-amber-100 drop-shadow-[0_0_5px_rgba(251,191,36,0.3)]">
              ANALOG RHYTHM
            </h1>
            <p className="text-amber-200/70 font-mono text-sm tracking-widest">
              MODEL SR-16 • STEP SEQUENCER
            </p>

            {/* VU Meter */}
            <div className="absolute right-2 top-4 w-24 h-8 bg-black/50 rounded-sm border border-zinc-700 overflow-hidden hidden md:block">
              <div
                className="h-full bg-gradient-to-r from-green-500 to-yellow-500 flex items-center transition-all duration-300"
                style={{ width: `${playing ? 50 + Math.random() * 40 : 10}%` }}
              >
                <div
                  className="h-full w-[1px] bg-black/30"
                  style={{ marginLeft: "30%" }}
                ></div>
                <div
                  className="h-full w-[1px] bg-black/30"
                  style={{ marginLeft: "30%" }}
                ></div>
                <div
                  className="h-full w-[1px] bg-black/30"
                  style={{ marginLeft: "20%" }}
                ></div>
              </div>
              <div className="absolute top-0 left-0 w-full h-full flex justify-between px-2 items-center">
                <span className="text-[8px] text-amber-100/80">0</span>
                <span className="text-[8px] text-amber-100/80">VU</span>
                <span className="text-[8px] text-amber-100/80">10</span>
              </div>
            </div>
          </header>

          <div className="transport-controls flex flex-wrap items-center justify-between gap-4 mb-6 p-4 bg-zinc-900 rounded border border-zinc-700 relative">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-14 w-14 rounded-full border-2 border-amber-700 bg-gradient-to-b from-zinc-800 to-zinc-900 hover:bg-amber-900 overflow-hidden relative"
                onClick={togglePlayback}
              >
                {playing ? (
                  <Pause className="h-6 w-6 text-amber-200" />
                ) : (
                  <Play className="h-6 w-6 text-amber-200" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-white/5 pointer-events-none"></div>
              </Button>
              <div className="text-xs font-mono text-amber-400/80">
                {playing ? "STOP" : "PLAY"}
              </div>
            </div>

            <div className="flex-1 max-w-xs">
              <div className="flex flex-col">
                <div className="flex justify-between mb-1">
                  <span className="text-xs text-amber-400/80 font-mono">
                    TEMPO
                  </span>
                  <span className="text-sm font-mono bg-zinc-950 px-2 rounded border border-zinc-800 text-amber-300">
                    {bpm} BPM
                  </span>
                </div>
                <Slider
                  value={[bpm]}
                  min={60}
                  max={200}
                  step={1}
                  onValueChange={(value) => setBpm(value[0])}
                  // className="[&>span]:bg-amber-600 [&>span]:h-[3px] [&>span]:rounded-none [&>span]:shadow-[0_0_5px_rgba(217,119,6,0.5)]"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex flex-col">
                <div className="flex justify-between mb-1">
                  <span className="text-xs text-amber-400/80 font-mono">
                    VOLUME
                  </span>
                  <button onClick={toggleMute}>
                    {muted ? (
                      <VolumeX className="h-4 w-4 text-red-500" />
                    ) : (
                      <Volume2 className="h-4 w-4 text-green-500" />
                    )}
                  </button>
                </div>
                <Slider
                  value={[volume]}
                  min={0}
                  max={100}
                  step={1}
                  onValueChange={(value) => setVolume(value[0])}
                  disabled={muted}
                  className={`${muted ? "opacity-50" : ""}`}
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* <Button
                variant="outline"
                size="icon"
                className="border-amber-700 bg-zinc-800 hover:bg-amber-900"
                onClick={savePattern}
              >
                <Save className="h-4 w-4 text-amber-200" />
              </Button> */}
              <Button
                variant="outline"
                size="icon"
                className="border-red-900 bg-zinc-800 hover:bg-red-900"
                onClick={clearPattern}
              >
                <Trash2 className="h-4 w-4 text-amber-200" />
              </Button>
              <Button
                variant="outline"
                className="text-xs border-amber-700 bg-zinc-800 hover:bg-amber-900 font-mono"
                onClick={loadDemoPattern}
              >
                DEMO
              </Button>
            </div>
          </div>

          <div className="sequencer-grid bg-zinc-950 p-6 rounded border border-zinc-800 relative overflow-hidden">
            {/* Grid lines overlay effect */}
            <div className="absolute inset-0 bg-[repeating-linear-gradient(to_right,transparent,transparent_calc(100%/16),rgba(255,255,255,0.03)_calc(100%/16),rgba(255,255,255,0.03)_calc(100%/16+1px))] pointer-events-none"></div>
            <div className="absolute inset-0 bg-[repeating-linear-gradient(to_bottom,transparent,transparent_calc(100%/5),rgba(255,255,255,0.03)_calc(100%/5),rgba(255,255,255,0.03)_calc(100%/5+1px))] pointer-events-none"></div>

            {/* Light reflection */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none"></div>

            {/* CRT scan line effect */}
            <div className="absolute inset-0 bg-[repeating-linear-gradient(to_bottom,transparent,transparent_2px,rgba(0,0,0,0.03)_2px,rgba(0,0,0,0.03)_4px)] pointer-events-none opacity-20"></div>

            <div className="mb-3 grid grid-cols-[120px_repeat(16,1fr)] gap-1 relative">
              <div className="text-center text-xs text-amber-500/70 font-mono">
                TRACKS
              </div>
              {Array.from({ length: 16 }).map((_, i) => (
                <div
                  key={i}
                  className={`text-center text-xs font-mono ${
                    currentStep === i
                      ? "text-amber-300 animate-pulse-glow"
                      : i % 4 === 0
                      ? "text-amber-500/70"
                      : "text-amber-500/40"
                  }`}
                >
                  {i + 1}
                </div>
              ))}
            </div>

            {trackConfig.map((track, trackIndex) => (
              <div
                key={trackIndex}
                className="grid grid-cols-[120px_repeat(16,1fr)] gap-1 mb-3"
              >
                <div className="bg-zinc-800 rounded flex items-center px-3 text-xs font-mono text-amber-400/90 border-l-4 border-amber-700">
                  {track.name}
                </div>
                {Array.from({ length: 16 }).map((_, stepIndex) => (
                  <DrumPad
                    key={stepIndex}
                    trackIndex={trackIndex}
                    stepIndex={stepIndex}
                    isActive={currentStep === stepIndex}
                    isTriggered={
                      currentStep === stepIndex &&
                      sequence[trackIndex][stepIndex]
                    }
                    isSelected={sequence[trackIndex][stepIndex]}
                    color={track.color}
                    onToggle={() => togglePad(trackIndex, stepIndex)}
                  />
                ))}
              </div>
            ))}
          </div>

          {/* <div className="mt-6 p-4 bg-zinc-900 rounded border border-zinc-700 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
            <div className="flex flex-wrap justify-between gap-4 items-center">
              <div className="flex items-center gap-2">
                <Switch
                  id="vinyl"
                  className="data-[state=checked]:bg-amber-700"
                  checked={tapeEffect}
                  onCheckedChange={setTapeEffect}
                />
                <Label
                  htmlFor="vinyl"
                  className="text-xs text-amber-400/80 font-mono"
                >
                  TAPE SATURATION
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  id="reverb"
                  className="data-[state=checked]:bg-amber-700"
                  checked={reverbEffect}
                  onCheckedChange={setReverbEffect}
                />
                <Label
                  htmlFor="reverb"
                  className="text-xs text-amber-400/80 font-mono"
                >
                  REVERB
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Input
                  className="w-32 h-8 bg-zinc-800 border-zinc-700 text-sm font-mono text-amber-300 placeholder:text-amber-700/50"
                  placeholder="Pattern name"
                />
              </div>
            </div>
          </div> */}
        </div>

        <footer className="mt-8 text-center text-xs text-amber-400/60 font-mono">
          <p>
            VINTAGE DRUM SEQUENCER • 1984 • Developed by{" "}
            <a
              href="https://coffey.codes"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-300 hover:underline"
            >
              Anthony Coffey
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
