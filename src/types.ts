export type Point = [number, number];
export type Vector = [number, number];
export type Mirror = [Point, Point];
export type SceneObjects = {
  color: string | string[];
  point: Point;
  rotation: number;
};
