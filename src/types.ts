export type Point = [number, number];
export type Vector = [number, number];
export type Line = { start: Point; end: Point; color: string };
export type SceneObjects = {
  color: string | string[];
  point: Point;
  rotation: number;
  opacity?: number;
};

export type LightRay = {
  start: Point;
  direction: number;
  distance: number;
  color: string;
};
