"use client";

import { useState, useEffect, useRef, useImperativeHandle, forwardRef } from "react";
import { Button } from "@/components/ui/button";

interface InteractivePianoProps {
  onPlayNote?: (note: string) => void;
  className?: string;
}

export interface InteractivePianoRef {
  playNote: (note: string) => void;
  playMelody: () => void;
}

const InteractivePiano = forwardRef<InteractivePianoRef, InteractivePianoProps>(({ onPlayNote, className = "" }, ref) => {
  const [activeKeys, setActiveKeys] = useState<Set<string>>(new Set());
  const [isPlayingSequence, setIsPlayingSequence] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  const initAudioContext = () => {
    if (!audioContextRef.current) {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      audioContextRef.current = new AudioContext();
      gainNodeRef.current = audioContextRef.current.createGain();
      gainNodeRef.current.connect(audioContextRef.current.destination);
      gainNodeRef.current.gain.setValueAtTime(0.3, audioContextRef.current.currentTime);
    }
    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }
    return audioContextRef.current;
  };

  const whiteKeys = ["C", "D", "E", "F", "G", "A", "B"];
  const blackKeys = ["C#", "D#", "F#", "G#", "A#"];
 
  // Use relative positioning for better responsiveness
  const blackKeyOffsets = new Map([
    ['C#', '10.71%'], // (14.28% * 0.75)
    ['D#', '25%'],     // (14.28% * 1.75)
    ['F#', '53.57%'],  // (14.28% * 3.75)
    ['G#', '67.85%'],  // (14.28% * 4.75)
    ['A#', '82.14%']   // (14.28% * 5.75)
  ]);

  const noteFrequencies: { [key: string]: number } = {
    'C': 261.63, 'C#': 277.18, 'D': 293.66, 'D#': 311.13, 'E': 329.63,
    'F': 349.23, 'F#': 369.99, 'G': 392.00, 'G#': 415.30, 'A': 440.00,
    'A#': 466.16, 'B': 493.88
  };

  const playNote = (note: string) => {
    setActiveKeys(prev => new Set(prev).add(note));
    onPlayNote?.(note);
    
    try {
      const audioContext = initAudioContext();
      if (!audioContext || !gainNodeRef.current) return;

      const oscillator = audioContext.createOscillator();
      const noteGain = audioContext.createGain();
      oscillator.type = 'triangle';
      oscillator.frequency.setValueAtTime(noteFrequencies[note] || 440, audioContext.currentTime);
      
      const now = audioContext.currentTime;
      const attackTime = 0.01, decayTime = 0.1, sustainLevel = 0.3, releaseTime = 0.3;
      
      oscillator.connect(noteGain);
      noteGain.connect(gainNodeRef.current);
      
      noteGain.gain.setValueAtTime(0, now);
      noteGain.gain.linearRampToValueAtTime(0.4, now + attackTime);
      noteGain.gain.linearRampToValueAtTime(sustainLevel, now + attackTime + decayTime);
      noteGain.gain.setValueAtTime(sustainLevel, now + attackTime + decayTime);
      noteGain.gain.linearRampToValueAtTime(0, now + attackTime + decayTime + releaseTime);
      
      oscillator.start(now);
      oscillator.stop(now + attackTime + decayTime + releaseTime);
    } catch (error) {
      console.error('Error playing note:', error);
    }
    
    setTimeout(() => {
      setActiveKeys(prev => {
        const newSet = new Set(prev);
        newSet.delete(note);
        return newSet;
      });
    }, 300);
  };

  const playMelody = () => {
    if (isPlayingSequence) return;
    setIsPlayingSequence(true);
    const melody = ["C", "E", "G", "C", "G", "E", "C", "F", "A", "C", "A", "F", "C"];
    let index = 0;
    const playNext = () => {
      if (index < melody.length) {
        playNote(melody[index]);
        index++;
        setTimeout(playNext, 400);
      } else {
        setIsPlayingSequence(false);
      }
    };
    playNext();
  };

  const playNoteRef = useRef(playNote);
  useEffect(() => { playNoteRef.current = playNote; }, [playNote]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const keyMap: { [key: string]: string } = {
        'a': 'C', 's': 'D', 'd': 'E', 'f': 'F', 'g': 'G', 'h': 'A', 'j': 'B',
        'w': 'C#', 'e': 'D#', 't': 'F#', 'y': 'G#', 'u': 'A#'
      };
      const note = keyMap[e.key.toLowerCase()];
      if (note && !activeKeys.has(note)) {
        playNote(note);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeKeys]);

  useEffect(() => {
    return () => {
      if (audioContextRef.current) { audioContextRef.current.close(); }
    };
  }, []);

  useImperativeHandle(ref, () => ({
    playNote: playNoteRef.current,
    playMelody: () => {
      if (isPlayingSequence) return;
      setIsPlayingSequence(true);
      const melody = ["C", "E", "G", "C", "G", "E", "C", "F", "A", "C", "A", "F", "C"];
      let index = 0;
      const playNext = () => {
        if (index < melody.length) {
          playNoteRef.current(melody[index]);
          index++;
          setTimeout(playNext, 400);
        } else {
          setIsPlayingSequence(false);
        }
      };
      playNext();
    }
  }));

  return (
    // Main container with a subtle glow
    <div className={`relative bg-charcoal-dark p-4 sm:p-6 rounded-xl border border-fantasy-gold/20 shadow-xl shadow-fantasy-gold/5 ${className}`}>
        {/* Integrated control panel above the keys */}
        <div className="px-2 sm:px-4 pb-4 flex flex-col sm:flex-row justify-between items-center text-center sm:text-left">
            <div className="mb-3 sm:mb-0">
                <p className="text-sm font-semibold text-text-white">Interactive Piano</p>
                <p className="text-xs text-text-muted">Use A-J for white keys, W-U for black keys.</p>
            </div>
            <Button 
                onClick={playMelody}
                disabled={isPlayingSequence}
                variant="outline"
                className="btn-outline-gold text-xs h-8 px-3"
            >
                {isPlayingSequence ? "Playing..." : "Play Demo Melody"}
            </Button>
        </div>

        {/* Piano keyboard container with an inner shadow for depth */}
        <div className="relative h-48 w-full rounded-lg bg-black/50 shadow-inner p-2">
            {/* White keys container */}
            <div className="relative flex h-full w-full">
                {whiteKeys.map((key) => (
                <button
                    key={key}
                    onClick={() => playNote(key)}
                    className={`
                        relative w-[14.28%] h-full rounded-md
                        transition-all duration-100 ease-in-out
                        // 3D effect for white keys
                        bg-gradient-to-b from-gray-50 to-gray-300 border-b-4 border-gray-400
                        ${activeKeys.has(key)
                            ? 'bg-fantasy-gold/30 border-fantasy-gold shadow-inner' // Active state
                            : 'hover:bg-gray-100 active:bg-gray-200'
                        }
                    `}
                >
                    <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs text-gray-500 font-semibold select-none">
                        {key}
                    </span>
                </button>
                ))}

                {/* Black keys container */}
                <div className="absolute top-0 left-0 h-full w-full pointer-events-none">
                    {blackKeys.map((key) => (
                        <button
                        key={key}
                        onClick={() => playNote(key)}
                        className={`
                            absolute w-[8%] h-[60%] rounded-b-md pointer-events-auto
                            transition-all duration-100 ease-in-out
                            // 3D effect for black keys
                            bg-gradient-to-b from-gray-800 to-black border-b-4 border-black shadow-md
                            ${activeKeys.has(key)
                                ? 'bg-fantasy-gold shadow-inner' // Active state
                                : 'hover:bg-gray-700'
                            }
                        `}
                        style={{ left: blackKeyOffsets.get(key) }}
                        >
                        <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs text-white/80 font-semibold select-none">
                            {key}
                        </span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    </div>
  );
});

InteractivePiano.displayName = 'InteractivePiano';

export default InteractivePiano;