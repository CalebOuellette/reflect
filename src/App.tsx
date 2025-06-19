import { onMount } from "solid-js";

const SCALE = 20;
type Point = [number, number];
type Vector = [number, number];
type Mirror = [Point, Point];

function vectorAdd(a: Vector, b: Vector): Vector {
  return [a[0] + b[0], a[1] + b[1]];
}

function vectorSubtract(a: Vector, b: Vector): Vector {
  return [a[0] - b[0], a[1] - b[1]];
}

function vectorScale(v: Vector, scale: number): Vector {
  return [v[0] * scale, v[1] * scale];
}

function dotProduct(a: Vector, b: Vector): number {
  return a[0] * b[0] + a[1] * b[1];
}

function vectorNormalize(v: Vector): Vector {
  const length = Math.sqrt(v[0] * v[0] + v[1] * v[1]);
  if (length === 0) return [0, 0];
  return [v[0] / length, v[1] / length];
}

function lineIntersection(
  p1: Point,
  p2: Point,
  p3: Point,
  p4: Point,
): Point | null {
  const x1 = p1[0],
    y1 = p1[1];
  const x2 = p2[0],
    y2 = p2[1];
  const x3 = p3[0],
    y3 = p3[1];
  const x4 = p4[0],
    y4 = p4[1];

  const denom = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
  if (Math.abs(denom) < 1e-10) return null;

  const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denom;
  const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / denom;

  if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
    return [x1 + t * (x2 - x1), y1 + t * (y2 - y1)];
  }
  return null;
}

function reflectVector(incident: Vector, normal: Vector): Vector {
  const normalizedNormal = vectorNormalize(normal);
  const dot = dotProduct(incident, normalizedNormal);
  return vectorSubtract(incident, vectorScale(normalizedNormal, 2 * dot));
}

function App() {
  let canvas: HTMLCanvasElement | undefined;

  const observer: Point = [5, 5];
  const object: Point = [5, 9];

  const mirrors: Mirror[] = [
    [
      [8, 0],
      [8, 10],
    ],
    [
      [0, 0],
      [0, 10],
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

    drawLineWithReflection(ctx, observer, [1, 0.1], mirrors);
  });

  return (
    <div>
      <canvas ref={canvas} id="scene" width="500" height="500"></canvas>
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

function drawLineWithReflection(
  ctx: CanvasRenderingContext2D,
  startPoint: Point,
  direction: Vector,
  mirrors: Mirror[],
  maxReflections = 10,
  maxDistance = 50,
  color = "blue",
  width = 1,
) {
  let currentPoint = startPoint;
  let currentDirection = vectorNormalize(direction);

  for (let reflection = 0; reflection < maxReflections; reflection++) {
    let closestIntersection: Point | null = null;
    let closestDistance = Infinity;
    let closestMirror: Mirror | null = null;

    const rayEnd: Point = [
      currentPoint[0] + currentDirection[0] * maxDistance,
      currentPoint[1] + currentDirection[1] * maxDistance,
    ];

    for (const mirror of mirrors) {
      const intersection = lineIntersection(
        currentPoint,
        rayEnd,
        mirror[0],
        mirror[1],
      );

      if (intersection) {
        const distance = Math.sqrt(
          Math.pow(intersection[0] - currentPoint[0], 2) +
            Math.pow(intersection[1] - currentPoint[1], 2),
        );

        if (distance > 0.001 && distance < closestDistance) {
          closestDistance = distance;
          closestIntersection = intersection;
          closestMirror = mirror;
        }
      }
    }

    if (closestIntersection && closestMirror) {
      drawLine(ctx, currentPoint, closestIntersection, color, width);

      const mirrorVector = vectorSubtract(closestMirror[1], closestMirror[0]);
      const mirrorNormal: Vector = [-mirrorVector[1], mirrorVector[0]];

      currentDirection = reflectVector(currentDirection, mirrorNormal);
      currentPoint = closestIntersection;
    } else {
      drawLine(ctx, currentPoint, rayEnd, color, width);
      break;
    }
  }
}

export default App;
