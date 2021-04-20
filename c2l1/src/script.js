import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";

/**
 * Minimal cost:

AmbientLight
HemisphereLight
Moderate cost:

DirectionalLight
PointLight
High cost:

SpotLight
RectAreaLight
 */

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
/* const ambientLight = new THREE.AmbientLight("white", 0.5);
scene.add(ambientLight);


const directionalLight = new THREE.DirectionalLight(0x00fffc, 0.3);
directionalLight.position.set(1, 0.25, 0);
const directionalLightFolder = gui.addFolder("directionalLight");
directionalLightFolder.add(directionalLight.position, "x", -20, 20, 0.01);
directionalLightFolder.add(directionalLight.position, "y", -20, 20, 0.01);
directionalLightFolder.add(directionalLight.position, "z", -20, 20, 0.01);
scene.add(directionalLight);
*/

const pointLight = new THREE.PointLight(0xff9000, 0.5, undefined, 2);
const pointLightFolder = gui.addFolder("pointLight");
pointLightFolder.add(pointLight.position, "x", -20, 20, 0.01);
pointLightFolder.add(pointLight.position, "y", -20, 20, 0.01);
pointLightFolder.add(pointLight.position, "z", -20, 20, 0.01);
pointLightFolder.add(pointLight, "intensity", 0, 3, 0.001);
pointLightFolder.add(pointLight, "distance", 0, 20, 0.01);
pointLightFolder.add(pointLight, "decay", 1, 10, 0.001);
scene.add(pointLight);
const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.2);
scene.add(pointLightHelper);

/* const hemisphereLight = new THREE.HemisphereLight(0xff0000, 0x0000ff, 0.3);
scene.add(hemisphereLight);
const hemisphereLightHelper = new THREE.HemisphereLightHelper(
  hemisphereLight,
  0.2
);
scene.add(hemisphereLightHelper); */

/* const rectAreaLight = new THREE.RectAreaLight(0x4e00ff, 2, 1, 1);
const rectAreaLightFolder = gui.addFolder("rectAreaLight");
rectAreaLightFolder
  .add(rectAreaLight.position, "x", -20, 20, 0.01)
  .name("posx");
rectAreaLightFolder
  .add(rectAreaLight.position, "y", -20, 20, 0.01)
  .name("posy");
rectAreaLightFolder
  .add(rectAreaLight.position, "z", -20, 20, 0.01)
  .name("posz");
rectAreaLightFolder
  .add(rectAreaLight.rotation, "x", -20, 20, 0.01)
  .name("rotx");
rectAreaLightFolder
  .add(rectAreaLight.rotation, "y", -20, 20, 0.01)
  .name("roty");
rectAreaLightFolder
  .add(rectAreaLight.rotation, "z", -20, 20, 0.01)
  .name("rotz");
rectAreaLightFolder.add(rectAreaLight, "intensity", 0, 3, 0.001);
//Vector3 with no parameters will default to 0,0,0
rectAreaLight.lookAt(new THREE.Vector3());
scene.add(rectAreaLight); */

/* const spotLight = new THREE.SpotLight(0x78ff00, 0.5, 10, Math.PI * 0.1, 0.5, 1);
spotLight.position.set(0, 2, 3);
scene.add(spotLight);
//To rotate the spotlight, we need to add its target to the scene
//The target can be any Object3D or the default spotLight target.
scene.add(spotLight.target); */

/**
 * Objects
 */
// Material
const material = new THREE.MeshStandardMaterial();
material.roughness = 0.4;

// Objects
const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), material);
sphere.position.x = -1.5;

const cube = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.75, 0.75), material);

const torus = new THREE.Mesh(
  new THREE.TorusGeometry(0.3, 0.2, 32, 64),
  material
);
torus.position.x = 1.5;

const plane = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), material);
plane.rotation.x = -Math.PI * 0.5;
plane.position.y = -0.65;

scene.add(sphere, cube, torus, plane);

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
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update objects
  sphere.rotation.y = 0.1 * elapsedTime;
  cube.rotation.y = 0.1 * elapsedTime;
  torus.rotation.y = 0.1 * elapsedTime;

  sphere.rotation.x = 0.15 * elapsedTime;
  cube.rotation.x = 0.15 * elapsedTime;
  torus.rotation.x = 0.15 * elapsedTime;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
