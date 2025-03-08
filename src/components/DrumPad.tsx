
import React, { useEffect } from 'react';
import { cn } from "@/lib/utils";
import { testAllSounds } from '@/utils/audioSamples';

interface DrumPadProps {
  trackIndex: number;
  stepIndex: number;
  isActive: boolean;
  color: string;
  isTriggered: boolean;
  isSelected: boolean;
  onToggle: () => void;
}

const DrumPad: React.FC<DrumPadProps> = ({ 
  trackIndex, 
  stepIndex, 
  isActive,
  color,
  isTriggered,
  isSelected,
  onToggle
}) => {
  // User interaction initialization for mobile browsers
  const handleClick = () => {
    // On first click on any pad, test all sounds (helps initialize audio on iOS)
    if (trackIndex === 0 && stepIndex === 0 && !isSelected) {
      console.log("First pad click, testing sounds");
      // Small timeout to ensure audio context is ready
      setTimeout(() => {
        testAllSounds();
      }, 100);
    }
    onToggle();
  };
  
  return (
    <button
      onClick={handleClick}
      className={cn(
        "w-full aspect-square rounded-sm transition-all overflow-hidden relative",
        "border border-zinc-700 flex items-center justify-center",
        "hover:brightness-125 active:scale-95 group focus:outline-none",
        {
          "bg-zinc-800": !isSelected,
          [color]: isSelected,
          "shadow-[0_0_5px_rgba(255,255,255,0.3)]": isActive,
          "scale-[0.98]": isActive,
          "ring-1 ring-white/30": isTriggered
        }
      )}
    >
      {isSelected && (
        <div 
          className={cn(
            "h-3 w-3 rounded-full bg-white/70 shadow-[0_0_4px_rgba(255,255,255,0.5)]",
            {
              "animate-pulse-glow": isTriggered,
              "scale-125 opacity-100": isTriggered,
              "scale-100 opacity-80": !isTriggered
            }
          )}
        />
      )}
      
      {/* Highlight effect when active */}
      <div className={cn(
        "absolute inset-0 bg-white/10 opacity-0 transition-opacity",
        { "opacity-30": isTriggered }
      )} />
      
      {/* Vintage line across pad */}
      <div className="absolute w-full h-[1px] bg-white/5 top-1/2 transform -translate-y-1/2" />
    </button>
  );
};

export default DrumPad;
