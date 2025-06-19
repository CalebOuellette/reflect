import { onMount, createEffect } from "solid-js";
import type { LightRay, Line, SceneObjects } from "../types";
import { generateReflectedObjects } from "../geometry";
import { drawLine, drawCircle, drawLineWithReflection } from "../drawing";

export type PlaygroundState = {
  objects: SceneObjects[];
  lightRays: LightRay[];
  mirrors: Line[];
  lines: Line[];
};

export function ReflectionPlayGroundRender(props: {
  playground: PlaygroundState;
}) {
  let canvas: HTMLCanvasElement | undefined;
  const draw = () => {
    if (!canvas) return;

    const ctx = canvas.getContext("2d")!;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw mirrors
    props.playground.mirrors.forEach((mirror) => {
      drawLine(ctx, mirror.start, mirror.end, mirror.color);
    });

    props.playground.objects.forEach((o) => {
      drawCircle(ctx, o, 0.5);
      const reflectedObjects = generateReflectedObjects(
        o,
        props.playground.mirrors,
        3,
      );
      reflectedObjects.forEach((reflectedObj) => {
        drawCircle(
          ctx,
          { ...o, opacity: 0.75, point: reflectedObj.point },
          0.5,
          reflectedObj.reflectionAxes,
        );
      });
    });

    //// Draw reflection line
    props.playground.lightRays.forEach((light) => {
      drawLineWithReflection(
        ctx,
        light.start,
        light.direction,
        props.playground.mirrors,
        10,
        50,
        "blue",
        1,
      );
    });

    props.playground.lines.forEach((line) => {
      drawLine(ctx, line.start, line.end, line.color);
    });
  };

  onMount(() => {
    if (!canvas) return;

    const ctx = canvas.getContext("2d")!;

    // Set display size (css pixels).
    var size = 600;
    canvas.style.width = size + "px";
    canvas.style.height = size + "px";

    // Set actual size in memory (scaled to account for extra pixel density).
    var scale = window.devicePixelRatio;
    canvas.width = size * scale;
    canvas.height = size * scale;

    // Normalize coordinate system to use css pixels.
    ctx.scale(scale, scale);

    // Initial draw
    draw();
  });

  // React to signal changes
  createEffect(() => {
    // Depend on all signals
    props.playground;
    // Redraw when any signal changes
    draw();
  });

  return (
    <div>
      <canvas
        ref={canvas}
        class="border-neutral-300 border shadow rounded-xl"
        id="scene"
        width="600"
        height="600"
      ></canvas>
    </div>
  );
}
