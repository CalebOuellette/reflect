import { Distance } from "./scenes/01_Distance";

function App() {
  const scenes = [
    { name: "Distance", component: Distance },
    // Add more scenes here as needed
  ];
  return (
    <div>
      {scenes.map((scene) => {
        const SceneComponent = scene.component;
        return (
          <div>
            <h2>{scene.name}</h2>
            <SceneComponent />
          </div>
        );
      })}
    </div>
  );
}

export default App;
