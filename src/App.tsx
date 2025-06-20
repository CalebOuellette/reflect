import { Distance } from "./scenes/01_Distance";
import { Angles } from "./scenes/02_Angles";
import { TwoMirrors } from "./scenes/03_TwoMirrors";
import { LightFromObject } from "./scenes/04_LightFromObject";
import { ThreeMirrors } from "./scenes/05_ThreeMirrors";
import { UnderstandingSides } from "./scenes/06_UnderstandingSides";

function App() {
  const scenes = [
    { name: "Distance", component: Distance },
    { name: "Angles", component: Angles },
    { name: "Two Mirrors", component: TwoMirrors },
    { name: "Light from Object", component: LightFromObject },
    { name: "Three Mirrors", component: ThreeMirrors },
    { name: "Understanding Sides", component: UnderstandingSides },
    // Add more scenes here as needed
  ];
  return (
    <div>
      {scenes.map((scene) => {
        const SceneComponent = scene.component;
        return (
          <div class="w-screen flex-col h-screen flex justify-center items-center">
            <h2>{scene.name}</h2>
            <SceneComponent />
          </div>
        );
      })}
    </div>
  );
}

export default App;
