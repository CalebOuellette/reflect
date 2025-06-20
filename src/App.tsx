import { Distance } from "./scenes/01_Distance";
import { Angles } from "./scenes/02_Angles";

function App() {
  const scenes = [
    { name: "Distance", component: Distance },
    { name: "Angles", component: Angles },
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
