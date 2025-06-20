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
      start: [20, 0],
      end: [20, 40],
      color: "#1f2937",
    },
  ],
  lines: [
    { start: [17, 15], end: [17, 25], color: "#22c55e" },
    { start: [8, 15], end: [8, 25], color: "#22c55e" },
  ],
};

export const Distance = () => {
  // State as signals
  const [objectPosition, setObjectPosition] = createSignal<Point>([12, 20]);
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

    // Check if crossing line at x=17 (index 0)
    if (checkLineCrossing(newPosition, oldPosition, 17)) {
      setCrossedLines((prev) => new Set([...prev, 0]));
    }

    // Check if crossing line at x=8 (index 1)
    if (checkLineCrossing(newPosition, oldPosition, 8)) {
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
          end: [20, objectPosition()[1] - 1.5],
          color: "#3b82f6",
          dotted: true,
        },
        ...dynamicLines,
      ],
    };
  };

  return (
    <div class="flex gap-3 flex-col justify-center items-center">
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
