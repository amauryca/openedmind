import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import timCheese from "@/assets/tim-cheese.jpg";

interface Position {
  x: number;
  y: number;
}

export const SnakeGame = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem("snakeHighScore") || "0");
  });
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const snakeRef = useRef<Position[]>([{ x: 10, y: 10 }]);
  const velocityRef = useRef({ x: 1, y: 0 });
  const foodRef = useRef<Position>({ x: 15, y: 15 });
  const gameSpeedRef = useRef(100);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (!gameStarted || isPaused) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const gridSize = 20;
    const tileCount = canvas.width / gridSize;
    let gameLoop: number;

    // Reset game state
    snakeRef.current = [{ x: 10, y: 10 }];
    velocityRef.current = { x: 1, y: 0 };
    gameSpeedRef.current = 100;
    foodRef.current = {
      x: Math.floor(Math.random() * tileCount),
      y: Math.floor(Math.random() * tileCount),
    };

    const drawGame = () => {
      if (!ctx || !canvas) return;

      const snake = snakeRef.current;
      const velocity = velocityRef.current;
      const food = foodRef.current;

      // Clear canvas with gradient background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, "hsl(var(--background))");
      gradient.addColorStop(1, "hsl(var(--primary) / 0.05)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw grid
      ctx.strokeStyle = "hsl(var(--border) / 0.2)";
      ctx.lineWidth = 0.5;
      for (let i = 0; i <= tileCount; i++) {
        ctx.beginPath();
        ctx.moveTo(i * gridSize, 0);
        ctx.lineTo(i * gridSize, canvas.height);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i * gridSize);
        ctx.lineTo(canvas.width, i * gridSize);
        ctx.stroke();
      }

      // Move snake
      const head = { x: snake[0].x + velocity.x, y: snake[0].y + velocity.y };

      // Check wall collision
      if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        setGameOver(true);
        setGameStarted(false);
        return;
      }

      // Check self collision
      for (let i = 0; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
          setGameOver(true);
          setGameStarted(false);
          return;
        }
      }

      snakeRef.current = [head, ...snake];

      // Check food collision
      if (head.x === food.x && head.y === food.y) {
        setScore((prev) => {
          const newScore = prev + 1;
          // Increase speed every 5 points
          if (newScore % 5 === 0 && gameSpeedRef.current > 40) {
            gameSpeedRef.current -= 10;
            clearInterval(gameLoop);
            gameLoop = window.setInterval(drawGame, gameSpeedRef.current);
          }
          // Update high score
          if (newScore > highScore) {
            setHighScore(newScore);
            localStorage.setItem("snakeHighScore", newScore.toString());
          }
          return newScore;
        });
        foodRef.current = {
          x: Math.floor(Math.random() * tileCount),
          y: Math.floor(Math.random() * tileCount),
        };
      } else {
        snakeRef.current.pop();
      }

      // Load and draw Tim Cheese image for snake
      const img = new Image();
      img.src = timCheese;
      
      snakeRef.current.forEach((segment, index) => {
        ctx.save();
        
        // Head gets special treatment
        if (index === 0) {
          ctx.shadowBlur = 15;
          ctx.shadowColor = "hsl(var(--primary))";
        } else {
          ctx.shadowBlur = 8;
          ctx.shadowColor = "hsl(var(--primary) / 0.5)";
        }
        
        ctx.drawImage(
          img,
          segment.x * gridSize,
          segment.y * gridSize,
          gridSize,
          gridSize
        );
        ctx.restore();
      });

      // Draw food with pulsing effect
      const pulseSize = gridSize / 2 - 2 + Math.sin(Date.now() / 200) * 2;
      const foodGradient = ctx.createRadialGradient(
        foodRef.current.x * gridSize + gridSize / 2,
        foodRef.current.y * gridSize + gridSize / 2,
        0,
        foodRef.current.x * gridSize + gridSize / 2,
        foodRef.current.y * gridSize + gridSize / 2,
        pulseSize
      );
      foodGradient.addColorStop(0, "hsl(var(--primary))");
      foodGradient.addColorStop(1, "hsl(var(--primary) / 0.6)");
      
      ctx.fillStyle = foodGradient;
      ctx.shadowBlur = 20;
      ctx.shadowColor = "hsl(var(--primary))";
      ctx.beginPath();
      ctx.arc(
        foodRef.current.x * gridSize + gridSize / 2,
        foodRef.current.y * gridSize + gridSize / 2,
        pulseSize,
        0,
        Math.PI * 2
      );
      ctx.fill();
      ctx.shadowBlur = 0;
    };

    const handleKeyPress = (e: KeyboardEvent) => {
      const velocity = velocityRef.current;
      
      if (e.key === " " || e.key === "Escape") {
        e.preventDefault();
        setIsPaused((prev) => !prev);
        return;
      }
      
      switch (e.key) {
        case "ArrowUp":
        case "w":
        case "W":
          e.preventDefault();
          if (velocity.y === 0) velocityRef.current = { x: 0, y: -1 };
          break;
        case "ArrowDown":
        case "s":
        case "S":
          e.preventDefault();
          if (velocity.y === 0) velocityRef.current = { x: 0, y: 1 };
          break;
        case "ArrowLeft":
        case "a":
        case "A":
          e.preventDefault();
          if (velocity.x === 0) velocityRef.current = { x: -1, y: 0 };
          break;
        case "ArrowRight":
        case "d":
        case "D":
          e.preventDefault();
          if (velocity.x === 0) velocityRef.current = { x: 1, y: 0 };
          break;
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      touchStartRef.current = { x: touch.clientX, y: touch.clientY };
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!touchStartRef.current) return;
      
      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - touchStartRef.current.x;
      const deltaY = touch.clientY - touchStartRef.current.y;
      const velocity = velocityRef.current;
      
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Horizontal swipe
        if (deltaX > 30 && velocity.x === 0) {
          velocityRef.current = { x: 1, y: 0 };
        } else if (deltaX < -30 && velocity.x === 0) {
          velocityRef.current = { x: -1, y: 0 };
        }
      } else {
        // Vertical swipe
        if (deltaY > 30 && velocity.y === 0) {
          velocityRef.current = { x: 0, y: 1 };
        } else if (deltaY < -30 && velocity.y === 0) {
          velocityRef.current = { x: 0, y: -1 };
        }
      }
      
      touchStartRef.current = null;
    };

    window.addEventListener("keydown", handleKeyPress);
    canvas.addEventListener("touchstart", handleTouchStart);
    canvas.addEventListener("touchend", handleTouchEnd);
    gameLoop = window.setInterval(drawGame, gameSpeedRef.current);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
      canvas.removeEventListener("touchstart", handleTouchStart);
      canvas.removeEventListener("touchend", handleTouchEnd);
      clearInterval(gameLoop);
    };
  }, [gameStarted, isPaused, highScore]);

  const startGame = () => {
    setScore(0);
    setGameOver(false);
    setGameStarted(true);
    setIsPaused(false);
  };

  return (
    <div className="flex flex-col items-center gap-4 mt-8">
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Score:</span>
            <span className="font-bold text-primary text-lg">{score}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">High Score:</span>
            <span className="font-bold text-foreground text-lg">{highScore}</span>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          Arrow keys or WASD • Space to pause • Speed increases every 5 points
        </p>
      </div>
      
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="border-2 border-primary/30 rounded-lg shadow-lg bg-background"
        />
        
        {isPaused && gameStarted && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-lg">
            <div className="text-center space-y-2">
              <p className="text-2xl font-bold text-foreground">Paused</p>
              <p className="text-sm text-muted-foreground">Press Space to continue</p>
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-3">
        {!gameStarted && (
          <Button onClick={startGame} variant="empathy" size="lg">
            {gameOver ? `Game Over! Final Score: ${score}` : "Start Game"}
          </Button>
        )}
        
        {gameStarted && (
          <Button 
            onClick={() => setIsPaused(!isPaused)} 
            variant="outline" 
            size="lg"
          >
            {isPaused ? "Resume" : "Pause"}
          </Button>
        )}
      </div>
    </div>
  );
};
