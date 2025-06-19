import { SCALE } from "../drawing";

export const SandBox = () => {
  const wrapperRef;
  // Signals for reactive state
  // Drag state
  const [isDragging, setIsDragging] = createSignal(false);

  // Helper function to convert canvas coordinates to world coordinates
  const canvasToWorld = (canvasX: number, canvasY: number): Point => {
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
    if (isNearObject(worldPos, object().point)) {
      setIsDragging(true);
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging()) {
      const worldPos = canvasToWorld(e.clientX, e.clientY);
      setObject((prev) => ({ ...prev, point: worldPos }));
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  wrapperRef.addEventListener("mousedown", handleMouseDown);
  wrapperRef.addEventListener("mousemove", handleMouseMove);
  wrapperRef.addEventListener("mouseup", handleMouseUp);
  wrapperRef.addEventListener("mouseleave", handleMouseUp); // Stop dragging if mouse leaves canvas

  return <div ref={wrapperRef}></div>;
};
