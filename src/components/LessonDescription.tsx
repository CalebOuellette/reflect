import type { JSX } from "solid-js";

interface LessonDescriptionProps {
  title: string;
  description: string;
  isComplete: boolean;
  children?: JSX.Element;
}

export function LessonDescription(props: LessonDescriptionProps) {
  return (
    <div class="p-5 bg-slate-50 border w-[600px] rounded-2xl border-slate-200">
      <div class="mb-4 text-center">
        <h3 class="text-slate-800 font-semibold mb-2">{props.title}</h3>
        <p class="text-slate-500 text-sm">{props.description}</p>
      </div>

      {props.children}

      {props.isComplete && (
        <div class="mt-4 p-4 bg-green-100 border border-green-300 rounded-xl text-center">
          <div class="text-green-800 font-bold text-lg mb-1">🎉 Great job!</div>
        </div>
      )}
    </div>
  );
}

