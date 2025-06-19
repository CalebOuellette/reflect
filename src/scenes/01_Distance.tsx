import { ReflectionPlayGroundRender } from "../components/ReflectionPlayGroundRender";

export const Distance = () => {
  return (
    <ReflectionPlayGroundRender
      playground={{
        objects: [
          { point: [5, 9], rotation: Math.PI / 4, color: "black" },
          { point: [3, 9], rotation: Math.PI / 4, color: "red" },
        ],
        lightRays: [
          { start: [5, 9], direction: 1, distance: 3, color: "blue" },
        ],
        mirrors: [
          [
            [10, 4.5],
            [0, 4.5],
          ],
        ],
      }}
    />
  );
};
