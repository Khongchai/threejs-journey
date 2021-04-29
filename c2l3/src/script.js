import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";
import { getHouse } from "./House/house";
import { getYard } from "./Yard/yard";
import { getAmbientLight } from "./Light/ambientLight";
import { getMoonLight } from "./Light/moonLight";
import { getGhosts } from "./Sprite/Ghosts";

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
 * Textures
 */
const textureLoader = new THREE.TextureLoader();

/**
 * Structure
 */
const house = getHouse(textureLoader);
scene.add(house);

const yard = getYard(textureLoader);
scene.add(yard);

/**
 * Lights
 */
// Ambient light
const ambientLight = getAmbientLight();
const ambientLightFolder = gui.addFolder("ambientLight");
ambientLightFolder.add(ambientLight, "intensity").min(0).max(1).step(0.001);
scene.add(ambientLight);

// Directional light
const moonLight = getMoonLight();
const moonLightFolder = gui.addFolder("moonLight");
moonLightFolder.add(moonLight, "intensity").min(0).max(1).step(0.001);
moonLightFolder.add(moonLight.position, "x").min(-5).max(5).step(0.001);
moonLightFolder.add(moonLight.position, "y").min(-5).max(5).step(0.001);
moonLightFolder.add(moonLight.position, "z").min(-5).max(5).step(0.001);
scene.add(moonLight);

/**
 * Fog
 */
const fog = new THREE.Fog("#262837", 1, 15);
scene.fog = fog;

/**
 * Ghosts
 */
const ghosts = getGhosts();
const [ghost1, ghost2, ghost3] = ghosts.children;
scene.add(ghosts);
/**
 * Sizes
 */
const sizes = {
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
camera.position.x = 4;
camera.position.y = 2;
camera.position.z = 5;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor("#262837");

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  //Ghosts
  const ghost1Angle = elapsedTime * 0.5;
  ghost1.position.x = Math.cos(ghost1Angle) * 4;
  ghost1.position.z = Math.sin(ghost1Angle) * 4;
  ghost1.position.y = Math.sin(elapsedTime * 3);

  const ghost2Angle = -elapsedTime * 0.32;
  ghost2.position.x = Math.cos(ghost2Angle) * 5;
  ghost2.position.z = Math.sin(ghost2Angle) * 5;
  ghost2.position.y =
    Math.sin(elapsedTime * 4) +
    Math.sin(elapsedTime * 2.5) +
    1 / 1 +
    Math.abs(Math.cos(Math.log10(elapsedTime * 2)));

  const ghost3Angle = -elapsedTime * 0.18;
  ghost3.position.x =
    Math.cos(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.32));
  ghost3.position.z = Math.sin(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.5));
  ghost3.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5);

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
