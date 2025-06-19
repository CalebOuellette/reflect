import { onMount } from "solid-js";

const SCALE = 10;
type Point = [number, number];
type Mirror = [Point, Point];

function App() {
  let myCanvas: HTMLCanvasElement | undefined;

  const observer: Point = [5, 5];
  const object: Point = [5, 9];

  const mirrors: Mirror[] = [
    [
      [8, 0],
      [8, 10],
    ],
  ];

  onMount(() => {
    if (!myCanvas) {
      return;
    }
    const ctx = myCanvas.getContext("2d")!;
    drawCircle(ctx, observer, 0.5);
    drawCircle(ctx, object, 0.5, "red");

    mirrors.forEach((mirror) => {
      drawLine(ctx, mirror[0], mirror[1], "gray");
    });
  });

  return (
    <div>
      <canvas ref={myCanvas} id="scene" width="800" height="600"></canvas>
    </div>
  );
}

function drawLine(
  ctx: CanvasRenderingContext2D,
  from: Point,
  to: Point,
  color = "red",
  width = 2,
) {
  ctx.beginPath();
  ctx.moveTo(from[0] * SCALE, from[1] * SCALE);
  ctx.lineTo(to[0] * SCALE, to[1] * SCALE);
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.stroke();
}

function drawCircle(
  ctx: CanvasRenderingContext2D,
  center: Point,
  radius = 5,
  color = "black",
) {
  ctx.beginPath();
  ctx.arc(center[0] * SCALE, center[1] * SCALE, radius * SCALE, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
}

export default App;
