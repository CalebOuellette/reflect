import type { Point, Vector, Mirror } from "./types";
import {
  vectorAdd,
  vectorScale,
  vectorSubtract,
  vectorNormalize,
} from "./vectorUtils";
import { lineIntersection, reflectVector } from "./geometry";

const SCALE = 20;

export function drawLine(
  ctx: CanvasRenderingContext2D,
  from: Point,
  to: Point,
  color = "red",
  width = 2
) {
  ctx.beginPath();
  ctx.moveTo(from[0] * SCALE, from[1] * SCALE);
  ctx.lineTo(to[0] * SCALE, to[1] * SCALE);
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.stroke();
}

export function drawCircle(
  ctx: CanvasRenderingContext2D,
  center: Point,
  radius = 5,
  color: string | string[] = "black"
) {
  if (Array.isArray(color) && color.length === 4) {
    // Draw 4 pie slices with different colors
    const colors = color as string[];
    const centerX = center[0] * SCALE;
    const centerY = center[1] * SCALE;
    const scaledRadius = radius * SCALE;

    for (let i = 0; i < 4; i++) {
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(
        centerX,
        centerY,
        scaledRadius,
        (i * Math.PI) / 2,
        ((i + 1) * Math.PI) / 2
      );
      ctx.lineTo(centerX, centerY);
      ctx.fillStyle = colors[i];
      ctx.fill();
    }
  } else {
    ctx.beginPath();
    ctx.arc(
      center[0] * SCALE,
      center[1] * SCALE,
      radius * SCALE,
      0,
      Math.PI * 2
    );
    ctx.fillStyle = color as string;
    ctx.fill();
  }
}

export function drawLineWithReflection(
  ctx: CanvasRenderingContext2D,
  startPoint: Point,
  direction: Vector,
  mirrors: Mirror[],
  maxReflections = 10,
  maxDistance = 50,
  color = "blue",
  width = 1
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
        mirror[1]
      );

      if (intersection) {
        const distance = Math.sqrt(
          Math.pow(intersection[0] - currentPoint[0], 2) +
            Math.pow(intersection[1] - currentPoint[1], 2)
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
