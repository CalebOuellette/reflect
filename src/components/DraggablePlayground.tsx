import { onMount, createSignal } from "solid-js";
import type { Point } from "../types";
import { SCALE } from "../drawing";
import {
  ReflectionPlayGroundRender,
  type PlaygroundState,
} from "./ReflectionPlayGroundRender";

export function DraggablePlayground(props: {
  playground: PlaygroundState;
  onObjectDrag?: (position: Point) => void;
}) {
  let wrapperRef: HTMLDivElement | undefined;

  // Drag state
  const [isDragging, setIsDragging] = createSignal(false);

  // Helper function to convert canvas coordinates to world coordinates
  const canvasToWorld = (canvasX: number, canvasY: number): Point => {
    if (!wrapperRef) return [0, 0];
    const canvas = wrapperRef.querySelector("canvas");
    if (!canvas) return [0, 0];

    const rect = canvas.getBoundingClientRect();
    const x = (canvasX - rect.left) / SCALE;
    const y = (canvasY - rect.top) / SCALE;
    return [x, y];
  };

  // Helper function to check if a point is near the object
  const isNearObject = (
    point: Point,
    object: Point,
    threshold = 0.5,
  ): boolean => {
    const dx = point[0] - object[0];
    const dy = point[1] - object[1];
    return Math.sqrt(dx * dx + dy * dy) < threshold;
  };

  // Mouse event handlers
  const handleMouseDown = (e: MouseEvent) => {
    const worldPos = canvasToWorld(e.clientX, e.clientY);
    // Check if clicking near any object
    const nearObject = props.playground.objects.find((obj) =>
      isNearObject(worldPos, obj.point),
    );
    if (nearObject) {
      setIsDragging(true);
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging() && props.onObjectDrag) {
      const worldPos = canvasToWorld(e.clientX, e.clientY);
      props.onObjectDrag(worldPos);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  onMount(() => {
    if (!wrapperRef) return;

    // Add event listeners for drag functionality
    wrapperRef.addEventListener("mousedown", handleMouseDown);
    wrapperRef.addEventListener("mousemove", handleMouseMove);
    wrapperRef.addEventListener("mouseup", handleMouseUp);
    wrapperRef.addEventListener("mouseleave", handleMouseUp);
  });

  return (
    <div ref={wrapperRef}>
      <ReflectionPlayGroundRender playground={props.playground} />
    </div>
  );
}

