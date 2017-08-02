const { ArcRotateCamera, Vector3 } = BABYLON;

const getCamera = ({ scene, canvas, target = Vector3.Zero(), radius = 25 }) => {
  const { PI } = Math;
  const rotation = { y: 1.5 * PI, x: PI / 3 };
  const camera = new ArcRotateCamera('Camera', rotation.y, rotation.x, radius, target, scene);
  camera.attachControl(canvas, false);
  return camera;
};

export default getCamera;
