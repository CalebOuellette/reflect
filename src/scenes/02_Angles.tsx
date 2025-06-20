import { createMemo, createSignal } from "solid-js";
import { DraggablePlayground } from "../components/DraggablePlayground";
import { type PlaygroundState } from "../components/ReflectionPlayGroundRender";
import { LessonDescription } from "../components/LessonDescription";
import { generateReflectedObjects } from "../geometry";
import type { Point } from "../types";

const startingPlayGroundState: PlaygroundState = {
  objects: [
    {
      id: "observer",
      point: [10, 10],
      rotation: Math.PI / 4,
      color: "blue",
      canGrab: true,
    },
    {
      id: "object",
      point: [10, 15],
      rotation: Math.PI / 4,
      color: "red",
      canGrab: true,
    },
  ],
  lightRays: [],
  mirrors: [
    {
      start: [15, 0],
      end: [15, 30],
      color: "#1f2937",
    },
  ],
  lines: [],
};

export const Angles = () => {
  // State for both objects
  const [observerPosition, setObserverPosition] = createSignal<Point>([10, 10]);
  const [objectPosition, setObjectPosition] = createSignal<Point>([10, 15]);

  const handleObjectDrag = (newPosition: Point, id: string) => {
    if (id === "observer") {
      setObserverPosition(newPosition);
    } else if (id === "object") {
      setObjectPosition(newPosition);
    }
  };

  const playground: () => PlaygroundState = () => {
    const observerObject = {
      id: "observer",
      point: observerPosition(),
      rotation: Math.PI / 4,
      color: "blue",
      canGrab: true,
    };

    const targetObject = {
      id: "object",
      point: objectPosition(),
      rotation: Math.PI / 4,
      color: "red",
      canGrab: true,
    };

    const reflectedObjects = generateReflectedObjects(
      observerObject,
      startingPlayGroundState.mirrors,
      3,
    );

    return {
      ...startingPlayGroundState,
      objects: [observerObject, targetObject],
    };
  };

  return (
    <div class="flex gap-3 flex-col justify-center items-center h-screen">
      <DraggablePlayground
        playground={playground()}
        onObjectDrag={handleObjectDrag}
      />

      <LessonDescription
        title="Angles Lesson Objective"
        description=""
        isComplete={false}
      />
    </div>
  );
};

