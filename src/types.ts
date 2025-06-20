export type Point = [number, number];
export type Vector = [number, number];
export type Line = { start: Point; end: Point; color: string; dotted?: boolean };
export type SceneObjects = {
  id: string;
  color: string | string[];
  point: Point;
  rotation: number;
  opacity?: number;
  canGrab?: boolean;
};

export type LightRay = {
  start: Point;
  direction: number;
  distance: number;
  color: string;
  maxLength?: number;
};
