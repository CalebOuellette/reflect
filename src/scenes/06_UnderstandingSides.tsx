import { createSignal } from "solid-js";
import { DraggablePlayground } from "../components/DraggablePlayground";
import { type PlaygroundState } from "../components/ReflectionPlayGroundRender";
import { LessonDescription } from "../components/LessonDescription";
import { generateReflectedObjects } from "../geometry";
import type { Point, Line, LightRay } from "../types";
import { vectorSubtract, vectorAngle } from "../vectorUtils";

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
      color: ["red", "blue", "green", "yellow"],
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
    {
      start: [5, 0],
      end: [5, 30],
      color: "#1f2937",
    },
    {
      start: [0, 20],
      end: [30, 20],
      color: "#1f2937",
    },
  ],
  lines: [],
};

export const UnderstandingSides = () => {
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
      rotation: Math.PI / 2,
      color: ["red", "blue", "green", "purple"],
      canGrab: true,
    };

    const reflectedObjects = generateReflectedObjects(
      targetObject,
      startingPlayGroundState.mirrors,
      5,
    );

    let lines: Line[] = [];
    let lightRays: LightRay[] = [];

    const colors = ["red", "blue", "green", "purple"];

    const selectedAngles = [
      reflectedObjects[10],
      reflectedObjects[1],
      reflectedObjects[0],
      reflectedObjects[4],
    ];

    selectedAngles.forEach((reflection, i) => {
      // Calculate vector from observer to reflected target
      const directionToReflected = vectorSubtract(
        reflection.point,
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
        end: reflection.point,
        color: colors[i],
        dotted: true,
      });

      // Draw lightRay from observer at the same angle using calculated distance
      lightRays.push({
        start: observerObject.point,
        direction: angle,
        distance: 20,
        color: colors[i],
        maxLength: distance,
      });
    });

    return {
      ...startingPlayGroundState,
      objects: [observerObject, targetObject],
      lines,
      lightRays,
    };
  };

  return (
    <div class="flex gap-3 flex-col justify-center items-center h-screen">
      <DraggablePlayground
        playground={playground()}
        onObjectDrag={handleObjectDrag}
      />

      <LessonDescription
        title="Understanding What Side We Are Seeing"
        description=""
        isComplete={false}
      />
    </div>
  );
};

