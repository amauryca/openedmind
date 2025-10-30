import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

interface Position {
  x: number;
  y: number;
}

export const SnakeGame = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const snakeRef = useRef<Position[]>([{ x: 10, y: 10 }]);
  const velocityRef = useRef({ x: 1, y: 0 });
  const foodRef = useRef<Position>({ x: 15, y: 15 });

  useEffect(() => {
    if (!gameStarted) return;
    
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
    foodRef.current = {
      x: Math.floor(Math.random() * tileCount),
      y: Math.floor(Math.random() * tileCount),
    };

    const drawGame = () => {
      if (!ctx || !canvas) return;

      const snake = snakeRef.current;
      const velocity = velocityRef.current;
      const food = foodRef.current;

      // Clear canvas
      ctx.fillStyle = "#0a0a0a";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

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
        setScore((prev) => prev + 1);
        foodRef.current = {
          x: Math.floor(Math.random() * tileCount),
          y: Math.floor(Math.random() * tileCount),
        };
      } else {
        snakeRef.current.pop();
      }

      // Draw snake with gradient
      snakeRef.current.forEach((segment, index) => {
        // Create gradient from purple to blue
        const gradient = ctx.createLinearGradient(
          segment.x * gridSize,
          segment.y * gridSize,
          (segment.x + 1) * gridSize,
          (segment.y + 1) * gridSize
        );
        gradient.addColorStop(0, "#8B5CF6");
        gradient.addColorStop(1, "#3B82F6");
        
        ctx.fillStyle = gradient;
        ctx.shadowBlur = 10;
        ctx.shadowColor = "#8B5CF6";
        ctx.fillRect(
          segment.x * gridSize + 1,
          segment.y * gridSize + 1,
          gridSize - 2,
          gridSize - 2
        );
        ctx.shadowBlur = 0;
      });

      // Draw food
      ctx.fillStyle = "#F59E0B";
      ctx.shadowBlur = 15;
      ctx.shadowColor = "#F59E0B";
      ctx.beginPath();
      ctx.arc(
        foodRef.current.x * gridSize + gridSize / 2,
        foodRef.current.y * gridSize + gridSize / 2,
        gridSize / 2 - 2,
        0,
        Math.PI * 2
      );
      ctx.fill();
      ctx.shadowBlur = 0;
    };

    const handleKeyPress = (e: KeyboardEvent) => {
      const velocity = velocityRef.current;
      switch (e.key) {
        case "ArrowUp":
          if (velocity.y === 0) velocityRef.current = { x: 0, y: -1 };
          break;
        case "ArrowDown":
          if (velocity.y === 0) velocityRef.current = { x: 0, y: 1 };
          break;
        case "ArrowLeft":
          if (velocity.x === 0) velocityRef.current = { x: -1, y: 0 };
          break;
        case "ArrowRight":
          if (velocity.x === 0) velocityRef.current = { x: 1, y: 0 };
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    gameLoop = window.setInterval(drawGame, 100);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
      clearInterval(gameLoop);
    };
  }, [gameStarted]);

  const startGame = () => {
    setScore(0);
    setGameOver(false);
    setGameStarted(true);
  };

  return (
    <div className="flex flex-col items-center gap-4 mt-8">
      <div className="text-center">
        <p className="text-sm text-muted-foreground mb-2">
          Use arrow keys to play • Score: {score}
        </p>
      </div>
      
      <canvas
        ref={canvasRef}
        width={400}
        height={400}
        className="border-2 border-primary/20 rounded-lg shadow-lg bg-background"
      />

      {!gameStarted && (
        <Button onClick={startGame} variant="empathy" size="lg">
          {gameOver ? `Game Over! Play Again (Score: ${score})` : "Start Game"}
        </Button>
      )}
    </div>
  );
};
