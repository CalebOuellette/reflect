import { ReflectionPlayGroundRender } from "../components/ReflectionPlayGroundRender";

export const Distance = () => {
  return (
    <ReflectionPlayGroundRender
      playground={{
        objects: [{ point: [5, 9], rotation: Math.PI / 4, color: "blue" }],
        lightRays: [
          { start: [5, 9], direction: 1, distance: 3, color: "blue" },
        ],
        mirrors: [
          {
            start: [10, 4.5],
            end: [0, 4.5],
            color: "gray",
          },
        ],
        lines: [],
      }}
    />
  );
};
