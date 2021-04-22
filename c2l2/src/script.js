import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";

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
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
gui.add(ambientLight, "intensity").min(0).max(1).step(0.001);
scene.add(ambientLight);

// Directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(2, 2, -1);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 2048;
directionalLight.shadow.mapSize.height = 2048;
gui.add(directionalLight, "intensity").min(0).max(1).step(0.001);
gui.add(directionalLight.position, "x").min(-5).max(5).step(0.001);

gui.add(directionalLight.position, "y").min(-5).max(5).step(0.001);
gui.add(directionalLight.position, "z").min(-5).max(5).step(0.001);
scene.add(directionalLight);

/**
 * Materials
 */
const material = new THREE.MeshStandardMaterial();
material.roughness = 0.7;
gui.add(material, "metalness").min(0).max(1).step(0.001);
gui.add(material, "roughness").min(0).max(1).step(0.001);

/**
 * Objects
 */
const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), material);
sphere.castShadow = true;

const plane = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), material);
plane.rotation.x = -Math.PI * 0.5;
plane.position.y = -0.5;
plane.receiveShadow = true;

scene.add(sphere, plane);

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
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 2;
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
//You can change the type of shadow map here
//Some map does not work with radius, for example, radius does not work with PCFSoftShadowMap
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

//Debug camera, because threejs's shadow map also uses camera
const directionalLightCameraHelper = new THREE.CameraHelper(
  directionalLight.shadow.camera
);
scene.add(directionalLightCameraHelper);
//because it works like any camera, we can adjust its "near" and "far" value as well
//which will represent the distance in which shadows are shown
const shadow = gui.addFolder("shadow camera");
directionalLight.shadow.camera.near = 1;
directionalLight.shadow.camera.far = 6;
shadow.add(directionalLight.shadow.camera, "near", 0, 20).onChange(() => {
  updateShadow();
});
shadow.add(directionalLight.shadow.camera, "far", 0, 20).onChange(() => {
  updateShadow();
});
//And because threejs is using OrthographicCamera for the shadow map from DirectionalLight,
//we can set how far each side of the camera can see with top, right, bottom, and left.
shadow
  .add(directionalLight.shadow.camera, "top", -10, 10, 0.01)
  .onChange(() => {
    updateShadow();
  });
shadow
  .add(directionalLight.shadow.camera, "right", -10, 10, 0.01)
  .onChange(() => {
    updateShadow();
  });
shadow
  .add(directionalLight.shadow.camera, "left", -10, 10, 0.01)
  .onChange(() => {
    updateShadow();
  });
shadow
  .add(directionalLight.shadow.camera, "bottom", -10, 10, 0.01)
  .onChange(() => {
    updateShadow();
  });
function updateShadow() {
  directionalLight.shadow.camera.updateProjectionMatrix();
  directionalLightCameraHelper.update();
}
gui.add(directionalLightCameraHelper, "visible").name("Shadow helper");
directionalLight.shadow.radius = 10;

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
