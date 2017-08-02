import Scene from './Scene.js';

const { Engine } = BABYLON;

const getCanvas = () => {
  const canvas = document.querySelector('canvas#renderCanvas');
  const engine = new Engine(canvas, true);
  window.addEventListener('resize', () => engine.resize());
  const scene = Scene({ engine });
  return { canvas, engine, scene };
};

export default getCanvas;
