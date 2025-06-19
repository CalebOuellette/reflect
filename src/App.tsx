import { onMount, createSignal, createEffect } from "solid-js";
import type { Point, Vector, Mirror } from "./types";
import { vectorAdd, vectorScale } from "./vectorUtils";
import { generateReflectedObjects } from "./geometry";
import { drawLine, drawCircle, drawLineWithReflection, SCALE } from "./drawing";

function App() {
  let canvas: HTMLCanvasElement | undefined;

  // Signals for reactive state
  const [observer, setObserver] = createSignal<Point>([5, 5]);
  const [object, setObject] = createSignal<Point>([5, 9]);
  const [mirrors, setMirrors] = createSignal<Mirror[]>([
    [
      [10, 4.5],
      [0, 4.5],
    ],
  ]);

  // Drag state
  const [isDragging, setIsDragging] = createSignal(false);

  // Helper function to convert canvas coordinates to world coordinates
  const canvasToWorld = (canvasX: number, canvasY: number): Point => {
    var scale = window.devicePixelRatio;
    if (!canvas) return [0, 0];
    const rect = canvas.getBoundingClientRect();
    const x = (canvasX - rect.left) / rect.width; // Scale to world coordinates (0-10)
    const y = (canvasY - rect.top) / rect.height;
    return [(x * rect.width) / SCALE, (y * rect.height) / SCALE];
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
    if (isNearObject(worldPos, object())) {
      console.log("hit");
      setIsDragging(true);
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging()) {
      const worldPos = canvasToWorld(e.clientX, e.clientY);
      setObject(worldPos);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const draw = () => {
    if (!canvas) return;

    const ctx = canvas.getContext("2d")!;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw observer
    drawCircle(ctx, observer(), 0.5);

    // Draw object
    drawCircle(ctx, object(), 0.5, ["red", "blue", "green", "yellow"], [], 0.8);

    // Draw mirrors
    mirrors().forEach((mirror) => {
      drawLine(ctx, mirror[0], mirror[1], "gray");
    });

    // Draw reflected objects
    const reflectedObjects = generateReflectedObjects(object(), mirrors(), 3);
    reflectedObjects.forEach((reflectedObj) => {
      drawCircle(
        ctx,
        reflectedObj.point,
        0.5,
        [
          `rgba(255, 0, 0, ${0.8})`,
          `rgba(0, 0, 255, ${0.8})`,
          `rgba(0, 255, 0, ${0.8})`,
          `rgba(255, 255, 0, ${0.8})`,
        ],
        reflectedObj.reflectionAxes,
        0.8,
      );
    });

    // Draw reflection line
    const vector: Vector = [1, 0.1];
    drawLineWithReflection(
      ctx,
      observer(),
      vector,
      mirrors(),
      10,
      50,
      "blue",
      1,
    );
    drawLine(ctx, observer(), vectorAdd(observer(), vectorScale(vector, 10)));
  };

  onMount(() => {
    if (!canvas) return;

    const ctx = canvas.getContext("2d")!;

    // Set display size (css pixels).
    var size = 500;
    canvas.style.width = size + "px";
    canvas.style.height = size + "px";

    // Set actual size in memory (scaled to account for extra pixel density).
    var scale = window.devicePixelRatio;
    canvas.width = size * scale;
    canvas.height = size * scale;

    // Normalize coordinate system to use css pixels.
    ctx.scale(scale, scale);

    // Add event listeners
    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseup", handleMouseUp);
    canvas.addEventListener("mouseleave", handleMouseUp); // Stop dragging if mouse leaves canvas

    // Initial draw
    draw();
  });

  // React to signal changes
  createEffect(() => {
    // Depend on all signals
    observer();
    object();
    mirrors();
    // Redraw when any signal changes
    draw();
  });

  return (
    <div>
      <canvas
        ref={canvas}
        class="border-neutral-800 border"
        id="scene"
        width="500"
        height="500"
      ></canvas>
    </div>
  );
}

export default App;
