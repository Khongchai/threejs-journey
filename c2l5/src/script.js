import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";
import { generateGalaxyAndAddToScene } from "./Galaxy/galaxy";
import { controlCamereaOnMouseEnter } from "./utils/canvas/controlCameraOnMouseEnter";

/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Galaxy
 */
const galaxyParams = {
  count: 50000,
  size: 0.02,
  radius: 5,
  branches: 3,
  spin: 1,
  randomness: 0.2,
  /**
   * Use for creating cluster around a galaxy's tail.
   */
  squeezePower: 3,
  insideColor: "#ff6030",
  outsideColor: "#1b3984",
};
generateGalaxyAndAddToScene(galaxyParams, scene);
//onFinishChange = change only after finish tampering with the value.
gui
  .add(galaxyParams, "count")
  .min(100)
  .max(1000000)
  .step(100)
  .onFinishChange(ggaasc);
gui
  .add(galaxyParams, "size")
  .min(0.001)
  .max(0.1)
  .step(0.001)
  .onFinishChange(ggaasc);
gui
  .add(galaxyParams, "radius")
  .min(0.01)
  .max(20)
  .step(0.01)
  .onFinishChange(ggaasc);
gui.add(galaxyParams, "branches").min(2).max(20).step(1).onFinishChange(ggaasc);
gui.add(galaxyParams, "spin").min(-5).max(5).step(0.001).onFinishChange(ggaasc);
gui
  .add(galaxyParams, "randomness")
  .min(0)
  .max(2)
  .step(0.001)
  .onFinishChange(ggaasc);
gui
  .add(galaxyParams, "squeezePower")
  .min(1)
  .max(10)
  .step(0.001)
  .onFinishChange(ggaasc);
gui.addColor(galaxyParams, "insideColor").onFinishChange(ggaasc);
gui.addColor(galaxyParams, "outsideColor").onFinishChange(ggaasc);
function ggaasc() {
  generateGalaxyAndAddToScene(galaxyParams, scene);
}

/**
 * Sizes
 */
export const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 3;
camera.position.y = 3;
camera.position.z = 3;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.autoRotate = true;
controlCamereaOnMouseEnter(canvas, camera, controls, sizes);
/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
