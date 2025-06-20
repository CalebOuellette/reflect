import type { Vector } from './types';

export function vectorAdd(a: Vector, b: Vector): Vector {
  return [a[0] + b[0], a[1] + b[1]];
}

export function vectorSubtract(a: Vector, b: Vector): Vector {
  return [a[0] - b[0], a[1] - b[1]];
}

export function vectorScale(v: Vector, scale: number): Vector {
  return [v[0] * scale, v[1] * scale];
}

export function dotProduct(a: Vector, b: Vector): number {
  return a[0] * b[0] + a[1] * b[1];
}

export function vectorNormalize(v: Vector): Vector {
  const length = Math.sqrt(v[0] * v[0] + v[1] * v[1]);
  if (length === 0) return [0, 0];
  return [v[0] / length, v[1] / length];
}

export function vectorAngle(v: Vector): number {
  return Math.atan2(v[1], v[0]);
}