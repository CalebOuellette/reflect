import { onMount } from "solid-js";
import type { Point, Vector, Mirror } from './types';
import { vectorAdd, vectorScale } from './vectorUtils';
import { generateReflectedObjects } from './geometry';
import { drawLine, drawCircle, drawLineWithReflection } from './drawing';

function App() {
  let canvas: HTMLCanvasElement | undefined;
  const observer: Point = [5, 5];
  const object: Point = [5, 9];

  const mirrors: Mirror[] = [
    [
      [10, 4.5],
      [0, 4.5],
    ],
  ];

  onMount(() => {
    if (!canvas) {
      return;
    }
    const ctx = canvas.getContext("2d")!;

    // Set display size (css pixels).
    var size = 500;
    canvas.style.width = size + "px";
    canvas.style.height = size + "px";

    // Set actual size in memory (scaled to account for extra pixel density).
    var scale = window.devicePixelRatio; // Change to 1 on retina screens to see blurry canvas.
    canvas.width = size * scale;
    canvas.height = size * scale;

    // Normalize coordinate system to use css pixels.
    ctx.scale(scale, scale);
    drawCircle(ctx, observer, 0.5);
    drawCircle(ctx, object, 0.5, "red");

    mirrors.forEach((mirror) => {
      drawLine(ctx, mirror[0], mirror[1], "gray");
    });

    const reflectedObjects = generateReflectedObjects(object, mirrors, 3);
    reflectedObjects.forEach((reflectedObj) => {
      drawCircle(ctx, reflectedObj, 0.5, `rgba(255, 0, 0, ${0.8})`);
    });

    const vector: Vector = [1, 0.1];
    drawLineWithReflection(ctx, observer, vector, mirrors, 10, 50, "blue", 1);
    drawLine(ctx, observer, vectorAdd(observer, vectorScale(vector, 10)));
  });

  return (
    <div>
      <canvas ref={canvas} id="scene" width="500" height="500"></canvas>
    </div>
  );
}


export default App;
