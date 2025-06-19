import type { Point, Vector, Mirror } from './types';
import { vectorSubtract, vectorScale, vectorNormalize, dotProduct } from './vectorUtils';

export function lineIntersection(
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

export function reflectVector(incident: Vector, normal: Vector): Vector {
  const normalizedNormal = vectorNormalize(normal);
  const dot = dotProduct(incident, normalizedNormal);
  return vectorSubtract(incident, vectorScale(normalizedNormal, 2 * dot));
}

export function reflectPointAcrossMirror(point: Point, mirror: Mirror): Point {
  const [p1, p2] = mirror;
  const mirrorVector = vectorSubtract(p2, p1);
  const mirrorNormal = vectorNormalize([-mirrorVector[1], mirrorVector[0]]);

  const pointToMirror = vectorSubtract(point, p1);
  const distanceToMirror = dotProduct(pointToMirror, mirrorNormal);

  const reflectedPoint = vectorSubtract(
    point,
    vectorScale(mirrorNormal, 2 * distanceToMirror),
  );
  return reflectedPoint;
}

export function generateReflectedObjects(
  object: Point,
  mirrors: Mirror[],
  maxDepth = 3,
): Point[] {
  debugger;
  const reflectedObjects: Point[] = [];
  const objectsToProcess: { point: Point; depth: number }[] = [
    { point: object, depth: 0 },
  ];
  const processedObjects = new Set<string>();

  while (objectsToProcess.length > 0) {
    const { point, depth } = objectsToProcess.shift()!;

    if (depth >= maxDepth) continue;

    for (const mirror of mirrors) {
      const reflected = reflectPointAcrossMirror(point, mirror);
      const key = `${reflected[0].toFixed(3)},${reflected[1].toFixed(3)}`;

      if (!processedObjects.has(key)) {
        processedObjects.add(key);
        reflectedObjects.push(reflected);
        objectsToProcess.push({ point: reflected, depth: depth + 1 });
      }
    }
  }

  return reflectedObjects;
}