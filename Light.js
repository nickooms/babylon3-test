const { Color3, Vector3, PointLight } = BABYLON;

const getLight = ({ scene, camera }) => {
  const light = Object.assign(
    new PointLight('light2', new Vector3(-20, 0, -20), scene),
    { diffuse: Color3.White(), specular: Color3.Green(), intensity: 0.6 },
  );
  scene.registerBeforeRender(() => {
    light.position = camera.position;
  });
  return light;
};

export default getLight;
