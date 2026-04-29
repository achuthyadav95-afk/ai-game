import { useState, useEffect, useRef, ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, SkipForward, SkipBack, Volume2, Music2, Search } from 'lucide-react';
import { Track } from '../types';

const DUMMY_TRACKS: Track[] = [
  {
    id: '1',
    title: 'Nebula Drift',
    artist: 'AI Echoes',
    duration: 184,
    coverUrl: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&q=80&w=200&h=200',
    color: '#00f3ff'
  },
  {
    id: '2',
    title: 'Synth Pulse',
    artist: 'Neural Beats',
    duration: 215,
    coverUrl: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&q=80&w=200&h=200',
    color: '#ff00ff'
  },
  {
    id: '3',
    title: 'Digital Horizon',
    artist: 'Cyber Flow',
    duration: 162,
    coverUrl: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=200&h=200',
    color: '#39ff14'
  }
];

const AUDIO_URLS = [
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3'
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const currentTrack = DUMMY_TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setProgress(Math.floor(audio.currentTime));
    const handleEnded = () => handleSkip(1);
    
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    
    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const handlePlayPause = () => setIsPlaying(!isPlaying);

  const handleSkip = (dir: number) => {
    const nextIndex = (currentTrackIndex + dir + DUMMY_TRACKS.length) % DUMMY_TRACKS.length;
    setCurrentTrackIndex(nextIndex);
    setProgress(0);
    // Auto play next track if we were already playing
  };

  const handleSeek = (e: ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setProgress(time);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full max-w-sm glass-morphism rounded-3xl p-6 border-white/10 flex flex-col gap-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <span className="text-[10px] uppercase tracking-widest text-gray-500 font-mono">System Audio Tuner</span>
        <Music2 size={16} className="text-neon-magenta" />
      </div>

      {/* Album Art Container */}
      <div className="relative group">
        <div className="aspect-square rounded-2xl overflow-hidden border border-white/10 relative">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentTrack.id}
              initial={{ scale: 1.1, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              src={currentTrack.coverUrl}
              alt={currentTrack.title}
              className="w-full h-full object-cover"
            />
          </AnimatePresence>
          
          {/* Visualizer overlay */}
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-1">
            {isPlaying && Array.from({ length: 8 }).map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  height: [10, Math.random() * 40 + 10, 10]
                }}
                transition={{
                  repeat: Infinity,
                  duration: 0.5 + Math.random() * 0.5,
                  ease: "easeInOut"
                }}
                style={{ backgroundColor: currentTrack.color }}
                className="w-1.5 rounded-full"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Track Info */}
      <div className="text-center space-y-1">
        <h3 className="text-xl font-display font-bold text-white tracking-tight">{currentTrack.title}</h3>
        <p className="text-sm font-mono text-gray-400 uppercase tracking-widest">{currentTrack.artist}</p>
      </div>

      {/* Hidden Audio Element */}
      <audio 
        ref={audioRef} 
        src={AUDIO_URLS[currentTrackIndex]} 
      />

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="relative group/slider">
          <input
            type="range"
            min="0"
            max={currentTrack.duration}
            value={progress}
            onChange={handleSeek}
            className="w-full h-1.5 bg-white/5 rounded-full appearance-none cursor-pointer accent-neon-cyan focus:outline-none"
            style={{
              background: `linear-gradient(to right, ${currentTrack.color} ${(progress / currentTrack.duration) * 100}%, rgba(255,255,255,0.05) ${(progress / currentTrack.duration) * 100}%)`
            }}
          />
        </div>
        <div className="flex justify-between text-[10px] font-mono text-gray-500">
          <span>{formatTime(progress)}</span>
          <span>{formatTime(currentTrack.duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-8">
        <button
          onClick={() => handleSkip(-1)}
          className="text-gray-400 hover:text-white transition-colors cursor-pointer"
        >
          <SkipBack size={24} />
        </button>
        
        <button
          onClick={handlePlayPause}
          className="w-16 h-16 rounded-full flex items-center justify-center bg-white text-black hover:scale-105 transition-transform cursor-pointer shadow-xl"
          style={{ boxShadow: `0 0 20px ${currentTrack.color}44` }}
        >
          {isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
        </button>

        <button
          onClick={() => handleSkip(1)}
          className="text-gray-400 hover:text-white transition-colors cursor-pointer"
        >
          <SkipForward size={24} />
        </button>
      </div>

      {/* Footer Info */}
      <div className="flex items-center justify-center gap-4 pt-4 border-t border-white/5">
        <Volume2 size={14} className="text-gray-500" />
        <div className="w-20 h-1 bg-white/10 rounded-full">
           <div className="w-2/3 h-full bg-white/20 rounded-full" />
        </div>
      </div>
    </div>
  );
}
