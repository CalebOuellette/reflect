import { createMemo, createSignal } from "solid-js";
import { DraggablePlayground } from "../components/DraggablePlayground";
import { type PlaygroundState } from "../components/ReflectionPlayGroundRender";
import { LessonDescription } from "../components/LessonDescription";
import { generateReflectedObjects } from "../geometry";
import type { Point } from "../types";

const startingPlayGroundState: PlaygroundState = {
  objects: [],
  lightRays: [],
  mirrors: [
    {
      start: [15, 0],
      end: [15, 30],
      color: "#1f2937",
    },
  ],
  lines: [
    { start: [12, 5], end: [12, 15], color: "#22c55e" },
    { start: [3, 5], end: [3, 15], color: "#22c55e" },
  ],
};

export const Distance = () => {
  // State as signals
  const [objectPosition, setObjectPosition] = createSignal<Point>([5, 9]);
  const [crossedLines, setCrossedLines] = createSignal<Set<number>>(new Set());

  const readyForNext = createMemo(() => {
    return crossedLines().size === 2;
  });

  // Helper function to check if object crosses a vertical line
  const checkLineCrossing = (newPos: Point, oldPos: Point, lineX: number) => {
    return (
      (oldPos[0] < lineX && newPos[0] > lineX) ||
      (oldPos[0] > lineX && newPos[0] < lineX)
    );
  };

  // Handle object position changes and check for line crossings
  const handleObjectDrag = (newPosition: Point, objectId: string) => {
    const oldPosition = objectPosition();

    // Check if crossing line at x=12 (index 0)
    if (checkLineCrossing(newPosition, oldPosition, 12)) {
      setCrossedLines((prev) => new Set([...prev, 0]));
    }

    // Check if crossing line at x=3 (index 1)
    if (checkLineCrossing(newPosition, oldPosition, 3)) {
      setCrossedLines((prev) => new Set([...prev, 1]));
    }

    setObjectPosition(newPosition);
  };

  // Create reactive playground state
  const playground: () => PlaygroundState = () => {
    const observerObject = {
      id: "observer",
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

    // Create lines with dynamic colors based on crossing state
    const dynamicLines = startingPlayGroundState.lines.map((line, index) => ({
      ...line,
      color: crossedLines().has(index) ? "#6b7280" : "#22c55e",
    }));

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
          color: "#dc2626",
          dotted: true,
        },
        {
          start: [objectPosition()[0], objectPosition()[1] - 1.5],
          end: [15, objectPosition()[1] - 1.5],
          color: "#3b82f6",
          dotted: true,
        },
        ...dynamicLines,
      ],
    };
  };

  return (
    <div class="flex gap-3 flex-col justify-center items-center h-screen">
      <DraggablePlayground
        playground={playground()}
        onObjectDrag={handleObjectDrag}
      />

      <LessonDescription
        title="Distance Lesson Objective"
        description="Drag the blue object across both green lines to turn them gray. Watch how the distances change as you move!"
        isComplete={readyForNext()}
      />
    </div>
  );
};
