import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";
import { SphereBufferGeometry } from "three";

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
const bakedShadow = textureLoader.load("/textures/bakedShadow.jpg");
const simpleShadow = textureLoader.load("/textures/simpleShadow.jpg");

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
gui
  .add(ambientLight, "intensity")
  .min(0)
  .max(1)
  .step(0.001)
  .name("ambientLight intensity");
scene.add(ambientLight);

// Directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(2, 2, -1);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 2048;
directionalLight.shadow.mapSize.height = 2048;
gui
  .add(directionalLight, "intensity")
  .min(0)
  .max(1)
  .step(0.001)
  .name("directionalLight intensity");
gui.add(directionalLight.position, "x").min(-5).max(5).step(0.001);

gui.add(directionalLight.position, "y").min(-5).max(5).step(0.001);
gui.add(directionalLight.position, "z").min(-5).max(5).step(0.001);
scene.add(directionalLight);

//Spot light
const spotLight = new THREE.SpotLight("white", 0.4, 10, Math.PI * 0.3);
spotLight.shadow.mapSize.width = 1024;
spotLight.shadow.mapSize.height = 1024;
spotLight.castShadow = true;
spotLight.position.set(0, 2, 2);
spotLight.shadow.camera.fov = 30;
spotLight.shadow.camera.near = 1;
spotLight.shadow.camera.far = 10;
scene.add(spotLight);
scene.add(spotLight.target);

const spotLightCameraHelper = new THREE.CameraHelper(spotLight.shadow.camera);
scene.add(spotLightCameraHelper);

//PointLight
const pointLight = new THREE.PointLight("white", 0.3);
pointLight.castShadow = true;
pointLight.position.set(-1, 1, 0);
pointLight.shadow.mapSize.width = 1024;
pointLight.shadow.mapSize.height = 1024;
pointLight.shadow.camera.near = 0.1;
pointLight.shadow.camera.far = 5;
scene.add(pointLight);

//pointLight's shadow camera is a perspective camera like SpotLight, but facing downward.
//pointLight illuminates in every direction; shines in 6 directions to craete a cube shadow map.
//The visible helper is the camera's position in the last of those 6 renders, which is downward.
//This can greatly impact performance.
const pointLightCameraHelper = new THREE.CameraHelper(pointLight.shadow.camera);
scene.add(pointLightCameraHelper);

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
renderer.shadowMap.enabled = false;

//Debug camera, because threejs's shadow map also uses camera
const directionalLightCameraHelper = new THREE.CameraHelper(
  directionalLight.shadow.camera
);
scene.add(directionalLightCameraHelper);
//because it works like any camera, we can adjust its "near" and "far" value as well
//which will represent the distance in which shadows are shown
const shadow = gui.addFolder("directionalLightCamera");
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

//fake spherical shadow: dynamic and performant, but less realistic
//fake a shadow with a sphere shadow texture and place it slightly above the floor
const sphereShadow = new THREE.Mesh(
  new THREE.PlaneGeometry(1.5, 1.5),
  new THREE.MeshBasicMaterial({
    color: "black",
    transparent: true,
    alphaMap: simpleShadow,
  })
);
//rotate -90 deg
sphereShadow.rotation.x = -Math.PI * 0.5;
//position 0.01 unit above ground
sphereShadow.position.y = plane.position.y + 0.01;

scene.add(sphere, sphereShadow, plane);

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  //Update sphere
  sphere.position.x = Math.cos(elapsedTime) * 1.5;
  sphere.position.z = Math.sin(elapsedTime) * 1.5;
  sphere.position.y = Math.abs(Math.sin(elapsedTime * 3));

  //Update shadow
  sphereShadow.position.x = sphere.position.x;
  sphereShadow.position.z = sphere.position.z;
  sphereShadow.material.opacity = (1 - sphere.position.y) * 0.3;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

const hideHelpers = () => {
  spotLightCameraHelper.visible = false;
  directionalLightCameraHelper.visible = false;
  pointLightCameraHelper.visible = false;
};

tick();
hideHelpers();
