import { createSignal } from "solid-js";
import { DraggablePlayground } from "../components/DraggablePlayground";
import { type PlaygroundState } from "../components/ReflectionPlayGroundRender";
import { LessonDescription } from "../components/LessonDescription";
import { generateReflectedObjects } from "../geometry";
import type { Point } from "../types";
import { vectorSubtract, vectorAngle } from "../vectorUtils";

const startingPlayGroundState: PlaygroundState = {
  objects: [
    {
      id: "observer",
      point: [17, 20],
      rotation: Math.PI / 4,
      color: "blue",
      canGrab: true,
    },
    {
      id: "object",
      point: [17, 25],
      rotation: Math.PI / 4,
      color: "red",
      canGrab: true,
    },
  ],
  lightRays: [],
  mirrors: [
    {
      start: [23, 0],
      end: [23, 27],
      color: "#1f2937",
    },
    {
      start: [17, 0],
      end: [17, 27],
      color: "#1f2937",
    },
    {
      start: [17, 27],
      end: [23, 27],
      color: "#1f2937",
    },
  ],
  lines: [],
};

export const ThreeMirrors = () => {
  // State for both objects
  const [observerPosition, setObserverPosition] = createSignal<Point>([20, 20]);
  const [objectPosition, setObjectPosition] = createSignal<Point>([20, 23]);

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
      targetObject,
      startingPlayGroundState.mirrors,
      3,
    );

    // Find the closest reflected object for demonstration
    const closestReflected = reflectedObjects[10];

    let lines = [];
    let lightRays = [];

    if (closestReflected) {
      // Calculate vector from observer to reflected target
      const directionToReflected = vectorSubtract(
        closestReflected.point,
        observerObject.point,
      );
      const angle = vectorAngle(directionToReflected);

      // Calculate distance between observer and reflected object
      const distance = Math.sqrt(
        directionToReflected[0] * directionToReflected[0] +
          directionToReflected[1] * directionToReflected[1],
      );

      // Draw line from observer to reflected target object
      lines.push({
        start: observerObject.point,
        end: closestReflected.point,
        color: "blue",
        dotted: true,
      });

      // Draw lightRay from observer at the same angle using calculated distance
      lightRays.push({
        start: observerObject.point,
        direction: angle,
        distance: 20,
        color: "blue",
        maxLength: distance,
      });
    }

    return {
      ...startingPlayGroundState,
      objects: [observerObject, targetObject],
      lines,
      lightRays,
    };
  };

  return (
    <div class="flex gap-3 flex-col justify-center items-center ">
      <DraggablePlayground
        playground={playground()}
        onObjectDrag={handleObjectDrag}
      />

      <LessonDescription
        title="Three Mirrors Lesson Objective"
        description=""
        isComplete={false}
      />
    </div>
  );
};
