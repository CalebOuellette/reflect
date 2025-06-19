import { createSignal } from "solid-js";
import { DraggablePlayground } from "../components/DraggablePlayground";
import { type PlaygroundState } from "../components/ReflectionPlayGroundRender";
import { generateReflectedObjects } from "../geometry";
import type { Point } from "../types";

const startingPlayGroundState: PlaygroundState = {
  objects: [],
  lightRays: [],
  mirrors: [
    {
      start: [15, 5],
      end: [15, 15],
      color: "gray",
    },
  ],
  lines: [
    { start: [12, 5], end: [12, 15], color: "green" },
    { start: [3, 5], end: [3, 15], color: "green" },
  ],
};

export const Distance = () => {
  // State as signals
  const [objectPosition, setObjectPosition] = createSignal<Point>([5, 9]);

  // Create reactive playground state
  const playground: () => PlaygroundState = () => {
    const observerObject = {
      point: objectPosition(),
      rotation: Math.PI / 4,
      color: "blue",
      canGrab: true,
    };

    const reflectedObjects = generateReflectedObjects(
      observerObject,
      startingPlayGroundState.mirrors,
      3,
    );

    return {
      ...startingPlayGroundState,
      objects: [observerObject],
      lines: [
        {
          start: [objectPosition()[0], objectPosition()[1] + -0.75],
          end: [
            reflectedObjects[0].point[0],
            reflectedObjects[0].point[1] - 0.75,
          ],
          color: "#890233",
        },
        {
          start: [objectPosition()[0], objectPosition()[1] - 1.5],
          end: [15, objectPosition()[1] - 1.5],
          color: "#89e283",
        },
        ...startingPlayGroundState.lines,
      ],
    };
  };

  return (
    <DraggablePlayground
      playground={playground()}
      onObjectDrag={setObjectPosition}
    />
  );
};
