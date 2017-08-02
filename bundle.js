const {
  Color3,
  Vector3,
  HemisphericLight,
  StandardMaterial,
  Mesh,
  Engine,
  ArcRotateCamera,
  PointLight,
  Vector2,
  PolygonMeshBuilder
} = BABYLON;

class BBOX {
  constructor(points = []) {
    this.min = { x: Infinity, y: Infinity };
    this.max = { x: -Infinity, y: -Infinity };
    this.addPoints(points);
  }

  addPoints(points) {
    points.forEach(([x, y]) => {
      ['min', 'max'].forEach((value) => {
        this[value] = {
          x: Math[value](this[value].x, x),
          y: Math[value](this[value].y, y),
        };
      });
    });
  }

  get center() {
    return {
      x: (this.max.x + this.min.x) / 2,
      y: (this.max.y + this.min.y) / 2,
    };
  }

  get width() {
    return this.max.x - this.min.x;
  }

  get height() {
    return this.max.y - this.min.y;
  }
}

const Scene = ({ engine, clearColor = new Color3(0.8, 0.8, 0.8) }) => {
  scene = Object.assign(new BABYLON.Scene(engine), { clearColor });

  Object.assign(new HemisphericLight('hemi', new Vector3(0, 1, 0), scene), {
    groundColor: new Color3(0.2, 0.2, 0.5),
    intensity: 0.6,
  });

  scene.scene = scene;

  return scene;
};

let scene;

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
  { material }
);

Ribbon.height = 2.4;

const getCanvas = () => {
  const canvas = document.querySelector('canvas#renderCanvas');
  const engine = new Engine(canvas, true);
  window.addEventListener('resize', () => engine.resize());
  const scene = Scene({ engine });
  return { canvas, engine, scene };
};

const getCamera = ({ scene, canvas, target = Vector3.Zero(), radius = 25 }) => {
  const { PI } = Math;
  const rotation = { y: 1.5 * PI, x: PI / 3 };
  const camera = new ArcRotateCamera('Camera', rotation.y, rotation.x, radius, target, scene);
  camera.attachControl(canvas, false);
  return camera;
};

const getLight = ({ scene, camera }) => {
  const light = Object.assign(
    new PointLight('light2', new Vector3(-20, 0, -20), scene),
    { diffuse: Color3.White(), specular: Color3.Green(), intensity: 0.6 }
  );
  scene.registerBeforeRender(() => {
    light.position = camera.position;
  });
  return light;
};

const Symbols = {
  '/': Symbol('/'),
  name: Symbol('name'),
  houseNumbers: Symbol('houseNumbers'),
  buildings: Symbol('buildings'),
};

class GEOObject {
  constructor({ id, name }) {
    this.id = id;
    this[Symbols.name] = name;
  }

  url(url = '/') {
    return `${this[Symbols.name]}/${this.id}${url === '/' ? '' : `/${url}`}`;
  }

  async json(name = '/') {
    const result = await fetch(`data/${this.url(name === '/' ? '/' : name.toLowerCase())}.js`);
    return await result.json();
  }

  async get(name = '/') {
    const symbol = Symbols[name];
    if (this[symbol] === undefined) {
      this[symbol] = await this.json(name);
    }
    return this[symbol];
  }
}

class Street extends GEOObject {
  constructor({ id = 7338 }) {
    super({ id, name: 'street' });
  }

  async houseNumbers() {
    return await this.get('houseNumbers');
  }

  async buildings() {
    return await this.get('buildings');
  }

  async plots() {
    return await this.get('plots');
  }
}

const switchPolygonXY = ({ polygon }) => polygon.map(([y, x]) => [x, y]);

const init = async () => {
  let { canvas, engine, scene } = getCanvas();
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
