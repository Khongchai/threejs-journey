import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";
import { DoubleSide, MeshMatcapMaterial } from "three";

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

/**
 * Objects + materials
 */
const textureLoader = new THREE.TextureLoader();
const doorColorTexture = textureLoader.load("/textures/door/color.jpg");
const doorAlphaTexture = textureLoader.load("/textures/door/alpha.jpg");
const doorAmbientOcclusionTexture = textureLoader.load(
  "/textures/door/ambientOcclusion.jpg"
);
const doorHeightTexture = textureLoader.load("/textures/door/height.jpg");
const doorNormalTexture = textureLoader.load("/textures/door/normal.jpg");
const doorMetalnessTexture = textureLoader.load("/textures/door/metalness.jpg");
const doorRoughnessTexture = textureLoader.load("/textures/door/roughness.jpg");
const matcapTexture = textureLoader.load("/textures/matcaps/4.png");
const gradientTexture = textureLoader.load("/textures/gradients/5.jpg");

// const material = new THREE.MeshNormalMaterial();
// material.transparent = true;
// material.alphaMap = doorAlphaTexture;
// material.color = new THREE.Color("#ff0000");
// material.side = THREE.DoubleSide;
// material.flatShading = true;
//Materials controller
// const gui = new dat.GUI();
// gui.add(material, "wireframe");
// gui.add(material, "transparent");
// gui.add(material, "opacity", 0, 1, 0.01);

// const material = new MeshMatcapMaterial();
// material.matcap = matcapTexture;

//MeshDepthMaterial color a geometry in white if close to the camera's near value and black if close to far.
//const material = new THREE.MeshDepthMaterial();

//MeshLambertMaterial and MeshPhongMaterial, amongst many, reacts to lights; other stuff above do not react to light (matcap creates "fake" lighting).
//by default, MeshToonMaterial gives you only two-part colorization, so let's change that.
//and disable the mipmapping (otherwise it will be blurry because the gradientTExture is very small)
// const toonMaterial = new THREE.MeshToonMaterial({ side: DoubleSide });
// material.shininess = 100;
// material.specular = new THREE.Color(0x1188ff);
// toonMaterial.gradientMap = gradientTexture;
// gradientTexture.minFilter = THREE.NearestFilter;
// gradientTexture.magFilter = THREE.NearestFilter;
// gradientTexture.generateMipmaps = false;

//MeshSTandardMaterial uses physically based rendering principles.
const material = new THREE.MeshStandardMaterial({
  side: DoubleSide,
  roughness: 0.45,
  metalness: 0.65,
});

material.map = doorColorTexture;
//we are using the displacementmap, so we have to make sure that there are enough subdivisions (vertices);
//and also reduce the strength of the displacement
material.displacementScale = 0.05;
const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 64, 64), material);
const plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 100, 100), material);

sphere.position.x = -1.5;

//ambient occlusion
//Needs a second set of uv for this
sphere.geometry.setAttribute(
  "uv2",
  new THREE.BufferAttribute(sphere.geometry.attributes.uv.array, 2)
);
plane.geometry.setAttribute(
  "uv2",
  new THREE.BufferAttribute(plane.geometry.attributes.uv.array, 2)
);

material.aoMap = doorAmbientOcclusionTexture;
material.aoMapIntensity = 1;
//Other realistic stuff
material.displacementMap = doorHeightTexture;
material.displacementSCale = 0.05;
material.metalnessMap = doorMetalnessTexture;
material.roughnessMap = doorRoughnessTexture;
material.metalness = 0;
material.roughness = 1;
material.normalMap = doorNormalTexture;
material.normalScale.set(0.5, 0.5);
//alpha
material.transparent = true;
material.alphaMap = doorAlphaTexture;

scene.add(sphere, plane);
const gui = new dat.GUI();
gui.add(material, "metalness", 0, 1, 0.0001);
gui.add(material, "roughness", 0, 1, 0.0001);

/**
 * Environment map: texture for the environment
 */
const envMaterial = new THREE.MeshStandardMaterial();
envMaterial.metalness = 0.7;
envMaterial.roughness = 0.2;
envMaterial.normalMap = doorNormalTexture;
const torus = new THREE.Mesh(
  new THREE.TorusGeometry(0.3, 0.2, 64, 128),
  envMaterial
);
torus.position.x = 1.5;
torus.geometry.setAttribute(
  "uv2",
  new THREE.BufferAttribute(torus.geometry.attributes.uv.array, 2)
);
gui.add(envMaterial, "metalness", 0, 1, 0.0001).name("envMetalness");
gui.add(envMaterial, "roughness", 0, 1, 0.0001).name("envRoughness");
const cubeTextureLoader = new THREE.CubeTextureLoader();
const environmentMapTexture = cubeTextureLoader.load([
  "/textures/environmentMaps/0/px.jpg",
  "/textures/environmentMaps/0/nx.jpg",
  "/textures/environmentMaps/0/py.jpg",
  "/textures/environmentMaps/0/ny.jpg",
  "/textures/environmentMaps/0/pz.jpg",
  "/textures/environmentMaps/0/nz.jpg",
]);
envMaterial.envMap = environmentMapTexture;
scene.add(torus);

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
const pointLight = new THREE.PointLight("#fff", 0.5);
pointLight.position.x = 2;
pointLight.position.y = 3;
pointLight.position.z = 4;
scene.add(ambientLight, pointLight);

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
  sphere.rotation.y = 0.1 * elapsedTime;
  plane.rotation.y = 0.1 * elapsedTime;
  torus.rotation.y = 0.1 * elapsedTime;

  sphere.rotation.x = 0.15 * elapsedTime;
  plane.rotation.x = 0.15 * elapsedTime;
  torus.rotation.x = 0.15 * elapsedTime;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
