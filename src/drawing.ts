import type { Point, Vector, Mirror } from "./types";
import {
  vectorAdd,
  vectorScale,
  vectorSubtract,
  vectorNormalize,
} from "./vectorUtils";
import { lineIntersection, reflectVector } from "./geometry";

export const SCALE = 20;

export function drawLine(
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

export function drawCircle(
  ctx: CanvasRenderingContext2D,
  center: Point,
  radius = 5,
  color: string | string[] = "black",
  reflectionAxes: Mirror[] = [],
  rotation: number = 0,
) {
  if (Array.isArray(color) && color.length === 4) {
    // Draw 4 pie slices with different colors, applying reflections to the orientation
    const colors = color as string[];
    const centerX = center[0] * SCALE;
    const centerY = center[1] * SCALE;
    const scaledRadius = radius * SCALE;

    // Calculate the rotation offset based on reflections
    // todo refactor into cool helper method...
    let rotationOffset = 0;
    let flipX = 1;
    let flipY = 1;

    for (const mirror of reflectionAxes) {
      const mirrorVector = vectorSubtract(mirror[1], mirror[0]);
      const mirrorAngle = Math.atan2(mirrorVector[1], mirrorVector[0]);

      // For each reflection, we need to flip the circle's orientation
      // A reflection across a horizontal line flips Y, across vertical flips X
      if (Math.abs(Math.sin(mirrorAngle)) < 0.1) {
        // Horizontal mirror
        flipY *= -1;
      } else if (Math.abs(Math.cos(mirrorAngle)) < 0.1) {
        // Vertical mirror
        flipX *= -1;
      } else {
        // Diagonal mirror - more complex reflection
        rotationOffset += 2 * mirrorAngle;
      }
    }

    // Apply the transformations
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.scale(flipX, flipY);
    ctx.rotate(rotationOffset);

    for (let i = 0; i < 4; i++) {
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(
        0,
        0,
        scaledRadius,
        rotation + (i * Math.PI) / 2,
        rotation + ((i + 1) * Math.PI) / 2,
      );
      ctx.lineTo(0, 0);
      ctx.fillStyle = colors[i];
      ctx.fill();
    }

    ctx.restore();
  } else {
    ctx.beginPath();
    ctx.arc(
      center[0] * SCALE,
      center[1] * SCALE,
      radius * SCALE,
      0,
      Math.PI * 2,
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
