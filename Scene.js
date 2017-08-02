const { Color3, Vector3, HemisphericLight } = BABYLON;

const Scene = ({ engine, clearColor = new Color3(0.8, 0.8, 0.8) }) => {
  const scene = Object.assign(new BABYLON.Scene(engine), { clearColor });

  Object.assign(new HemisphericLight('hemi', new Vector3(0, 1, 0), scene), {
    groundColor: new Color3(0.2, 0.2, 0.5),
    intensity: 0.6,
  });

  scene.scene = scene;

  return scene;
};

export default Scene;
