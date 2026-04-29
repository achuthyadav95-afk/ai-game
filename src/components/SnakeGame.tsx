import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, RotateCcw, Play } from 'lucide-react';
import { Direction, Point } from '../types';

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const INITIAL_SPEED = 150;
const SPEED_INCREMENT = 2;

export default function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Point>({ x: 15, y: 15 });
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [nextDirection, setNextDirection] = useState<Direction>('RIGHT');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameState, setGameState] = useState<'START' | 'PLAYING' | 'GAMEOVER'>('START');
  const [speed, setSpeed] = useState(INITIAL_SPEED);

  const moveSnake = useCallback(() => {
    setSnake((prevSnake) => {
      const head = prevSnake[0];
      const newHead = { ...head };

      switch (nextDirection) {
        case 'UP': newHead.y -= 1; break;
        case 'DOWN': newHead.y += 1; break;
        case 'LEFT': newHead.x -= 1; break;
        case 'RIGHT': newHead.x += 1; break;
      }

      setDirection(nextDirection);

      // Check collision with walls
      if (
        newHead.x < 0 || 
        newHead.x >= GRID_SIZE || 
        newHead.y < 0 || 
        newHead.y >= GRID_SIZE
      ) {
        setGameState('GAMEOVER');
        return prevSnake;
      }

      // Check collision with self
      if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        setGameState('GAMEOVER');
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check collision with food
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => s + 10);
        setSpeed(prev => Math.max(50, prev - SPEED_INCREMENT));
        spawnFood(newSnake);
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [nextDirection, food]);

  const spawnFood = (currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      if (!currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    setFood(newFood);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': if (direction !== 'DOWN') setNextDirection('UP'); break;
        case 'ArrowDown': if (direction !== 'UP') setNextDirection('DOWN'); break;
        case 'ArrowLeft': if (direction !== 'RIGHT') setNextDirection('LEFT'); break;
        case 'ArrowRight': if (direction !== 'LEFT') setNextDirection('RIGHT'); break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    if (gameState !== 'PLAYING') return;

    const interval = setInterval(moveSnake, speed);
    return () => clearInterval(interval);
  }, [gameState, speed, moveSnake]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#0d0d0d';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid lines
    ctx.strokeStyle = '#1a1a1a';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * CELL_SIZE, 0);
      ctx.lineTo(i * CELL_SIZE, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * CELL_SIZE);
      ctx.lineTo(canvas.width, i * CELL_SIZE);
      ctx.stroke();
    }

    // Draw snake
    snake.forEach((segment, index) => {
      const isHead = index === 0;
      ctx.fillStyle = isHead ? '#00f3ff' : '#00a3ab';
      
      // Add glow
      ctx.shadowBlur = 10;
      ctx.shadowColor = isHead ? '#00f3ff' : '#00a3ab';
      
      ctx.fillRect(
        segment.x * CELL_SIZE + 1,
        segment.y * CELL_SIZE + 1,
        CELL_SIZE - 2,
        CELL_SIZE - 2
      );
      ctx.shadowBlur = 0;
    });

    // Draw food
    ctx.fillStyle = '#ff00ff';
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#ff00ff';
    ctx.beginPath();
    ctx.arc(
      food.x * CELL_SIZE + CELL_SIZE / 2,
      food.y * CELL_SIZE + CELL_SIZE / 2,
      CELL_SIZE / 3,
      0,
      Math.PI * 2
    );
    ctx.fill();
    ctx.shadowBlur = 0;

  }, [snake, food]);

  const startGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setDirection('RIGHT');
    setNextDirection('RIGHT');
    setScore(0);
    setGameState('PLAYING');
    setSpeed(INITIAL_SPEED);
    spawnFood([{ x: 10, y: 10 }]);
  };

  useEffect(() => {
    if (score > highScore) setHighScore(score);
  }, [score, highScore]);

  return (
    <div className="flex flex-col items-center gap-6 p-8 glass-morphism rounded-3xl border-neon-cyan/30 border-2 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 p-4 opacity-10 font-display text-4xl font-bold tracking-tighter">
        NEON SYSTEM
      </div>

      <div className="flex justify-between w-full px-4 mb-2">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-widest text-gray-500 font-mono">Current Score</span>
          <span className="text-3xl font-display font-bold neon-glow-cyan text-neon-cyan">{score}</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[10px] uppercase tracking-widest text-gray-500 font-mono">High Score</span>
          <div className="flex items-center gap-2">
            <Trophy size={16} className="text-neon-lime" />
            <span className="text-xl font-display font-bold text-neon-lime">{highScore}</span>
          </div>
        </div>
      </div>

      <div className="relative group">
        <canvas
          ref={canvasRef}
          width={GRID_SIZE * CELL_SIZE}
          height={GRID_SIZE * CELL_SIZE}
          className="rounded-lg shadow-2xl shadow-neon-cyan/10 border border-white/5"
        />

        <AnimatePresence>
          {gameState !== 'PLAYING' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm rounded-lg"
            >
              {gameState === 'START' && (
                <>
                  <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="mb-8"
                  >
                    <h2 className="text-4xl font-display font-bold tracking-tighter text-white mb-2 neon-glow-cyan">
                      CYBER SNAKE
                    </h2>
                    <p className="text-gray-400 font-mono text-center text-sm uppercase tracking-widest">
                      Press start to initiate
                    </p>
                  </motion.div>
                  <button
                    onClick={startGame}
                    className="flex items-center gap-2 px-8 py-3 bg-neon-cyan text-black font-bold uppercase tracking-widest rounded-full hover:bg-white transition-colors group cursor-pointer"
                  >
                    <Play size={20} fill="currentColor" />
                    START SESSION
                  </button>
                </>
              )}

              {gameState === 'GAMEOVER' && (
                <div className="text-center">
                  <h2 className="text-5xl font-display font-bold text-neon-magenta mb-4 neon-glow-magenta">
                    SESSION FAILED
                  </h2>
                  <p className="text-gray-400 font-mono mb-8 uppercase tracking-widest">
                    Score achieved: <span className="text-white">{score}</span>
                  </p>
                  <button
                    onClick={startGame}
                    className="flex items-center gap-2 px-8 py-3 border-2 border-neon-cyan text-neon-cyan font-bold uppercase tracking-widest rounded-full hover:bg-neon-cyan hover:text-black transition-all cursor-pointer mx-auto"
                  >
                    <RotateCcw size={20} />
                    RESTART
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="w-full flex justify-center gap-8 mt-4 text-[10px] font-mono text-gray-500 uppercase tracking-widest">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-neon-cyan shadow-[0_0_5px_#00f3ff]" />
          <span>Move: Arrows</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-neon-magenta shadow-[0_0_5px_#ff00ff]" />
          <span>Avoid: Walls & Tail</span>
        </div>
      </div>
    </div>
  );
}
