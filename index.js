import BBOX from './BBOX.js';
import Ribbon from './Ribbon.js';
import getCanvas from './Canvas.js';
import getCamera from './Camera.js';
import getLight from './Light.js';
import Street from './Street.js';

const { Color3, Vector2, Vector3, PolygonMeshBuilder, StandardMaterial } = BABYLON;

const switchPolygonXY = ({ polygon }) => polygon.map(([y, x]) => [x, y]);

const init = async () => {
  const { canvas, engine, scene } = getCanvas();
  const bbox = new BBOX();
  const addPoints = points => bbox.addPoints(points);
  const street = new Street({ id: 7338 });
  const buildings = (await street.buildings()).map(switchPolygonXY);
  buildings.forEach(addPoints);
  const plots = (await street.plots()).map(switchPolygonXY);
  plots.forEach(addPoints);
  const { center, width, height } = bbox;
  const target = new Vector3(center.x, 0, center.y);
  const radius = Math.max(width, height) / 2;
  const camera = getCamera({ scene, canvas, target, radius });
  const light2 = getLight({ scene, camera });
  const materialBuilding = Object.assign(new StandardMaterial('mat1', scene), {
    alpha: 0.5,
    diffuseColor: new Color3(0.5, 0.5, 1.0),
    backFaceCulling: false,
  });
  const materialPlot = Object.assign(new StandardMaterial('mat1', scene), {
    alpha: 0.5,
    diffuseColor: new Color3(0.7, 0.7, 0.7),
    backFaceCulling: false,
  });
  buildings.forEach(path => Ribbon({ path }));
  buildings.forEach((path, index) => {
    const plot = path.map(([x, y]) => new Vector2(x, y));
    const polygonBuilder = new PolygonMeshBuilder(`plot${index}`, plot, scene);
    const polygon = polygonBuilder.build(true);
    polygon.material = materialBuilding;
    polygon.position.y = Ribbon.height * 3;
  });
  plots.forEach((path, index) => {
    const plot = path.map(([x, y]) => new Vector2(x, y));
    const polygonBuilder = new PolygonMeshBuilder(`plot${index}`, plot, scene);
    const polygon = polygonBuilder.build(true, 0.5);
    polygon.material = materialPlot;
  });
  engine.runRenderLoop(() => scene.render());
};

init();
