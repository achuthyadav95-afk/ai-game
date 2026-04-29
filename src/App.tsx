import { motion } from 'motion/react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { Terminal, Cpu, Zap } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-dark-bg text-gray-100 flex flex-col items-center justify-center p-4 md:p-8 relative overflow-hidden font-sans">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-neon-cyan/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-neon-magenta/5 rounded-full blur-[120px]" />
        
        {/* Grid Overlay */}
        <div 
          className="absolute inset-0 opacity-[0.03]" 
          style={{ 
            backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }} 
        />
        
        {/* Scanlines Effect */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.02]" 
          style={{ 
            backgroundImage: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))',
            backgroundSize: '100% 2px, 3px 100%'
          }} 
        />
      </div>

      <header className="z-10 mb-12 text-center relative">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="inline-flex items-center gap-2 px-3 py-1 glass-morphism rounded-full mb-4 border-neon-cyan/20"
        >
          <Zap size={14} className="text-neon-cyan" />
          <span className="text-[10px] font-mono tracking-[0.2em] text-neon-cyan">v4.2 // NEURAL_OS </span>
        </motion.div>
        
        <motion.h1 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-6xl md:text-8xl font-display font-bold tracking-tighter text-white neon-glow-cyan"
        >
          NEON<span className="text-neon-magenta neon-glow-magenta ml-4">SNAKE</span>
        </motion.h1>
        
        <p className="mt-4 text-gray-500 font-mono text-sm tracking-[0.3em] uppercase">
          Neural Interface Protocol Activated
        </p>
      </header>

      <main className="z-10 w-full max-w-6xl flex flex-col md:flex-row items-center justify-center gap-12">
        {/* Left Stats/Info (Desktop only) */}
        <div className="hidden lg:flex flex-col gap-6 w-48">
          <div className="glass-morphism rounded-2xl p-4 border-neon-cyan/20 space-y-4">
            <Terminal size={20} className="text-neon-cyan" />
            <div className="space-y-1">
              <div className="text-[8px] font-mono text-gray-600 uppercase">Latency</div>
              <div className="text-xs font-mono text-neon-cyan">4.02ms</div>
            </div>
            <div className="space-y-1">
              <div className="text-[8px] font-mono text-gray-600 uppercase">Cores</div>
              <div className="text-xs font-mono text-neon-cyan">8/16 ACTIVE</div>
            </div>
          </div>
          
          <div className="glass-morphism rounded-2xl p-4 border-neon-magenta/20 space-y-4">
            <Cpu size={20} className="text-neon-magenta" />
            <div className="space-y-1">
              <div className="text-[8px] font-mono text-gray-600 uppercase">Buffer</div>
              <div className="text-xs font-mono text-neon-magenta">STABLE</div>
            </div>
            <div className="space-y-1">
              <div className="text-[8px] font-mono text-gray-600 uppercase">Freq</div>
              <div className="text-xs font-mono text-neon-magenta">144Hz</div>
            </div>
          </div>
        </div>

        {/* Center: Snake Game */}
        <motion.div
           initial={{ y: 20, opacity: 0 }}
           animate={{ y: 0, opacity: 1 }}
           transition={{ delay: 0.2 }}
        >
          <SnakeGame />
        </motion.div>

        {/* Right: Music Player */}
        <motion.div
           initial={{ x: 20, opacity: 0 }}
           animate={{ x: 0, opacity: 1 }}
           transition={{ delay: 0.3 }}
        >
          <MusicPlayer />
        </motion.div>
      </main>

      <footer className="z-10 mt-16 text-[10px] font-mono text-gray-600 uppercase tracking-widest flex items-center gap-8">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-neon-lime rounded-full animate-pulse" />
          <span>System Healthy</span>
        </div>
        <span>© 2026 NEON_ENGINE.SYS</span>
        <div className="flex items-center gap-2">
          <span>Auth: achuthyadav8@gmail.com</span>
        </div>
      </footer>

      {/* Decorative Corners */}
      <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-neon-cyan/20 rounded-tl-xl pointer-events-none" />
      <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-neon-magenta/20 rounded-tr-xl pointer-events-none" />
      <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-neon-magenta/20 rounded-bl-xl pointer-events-none" />
      <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-neon-cyan/20 rounded-br-xl pointer-events-none" />
    </div>
  );
}
