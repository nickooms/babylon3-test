import Scene from './Scene.js';

const { StandardMaterial, Color3, Vector3, Mesh } = BABYLON;
const { scene } = Scene;

const Ribbon = ({
  path,
  heights = [0, 1, 2, 3].map(x => x * Ribbon.height),
  material = Object.assign(new StandardMaterial('mat1', scene), {
    alpha: 0.5,
    diffuseColor: new Color3(0.5, 0.5, 1.0),
    backFaceCulling: false,
  }),
}) => Object.assign(
  new Mesh.CreateRibbon('ribbon',
    heights.map(y => path.map(([x, z]) => new Vector3(x, y, z))),
    false, false, null, scene),
  { material },
);

Ribbon.height = 2.4;

export default Ribbon;
