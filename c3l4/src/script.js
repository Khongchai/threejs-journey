import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { sRGBEncoding } from "three";

/**
 * Base
 */
// Debug
const gui = new dat.GUI();
const debugObject = { envMapIntensity: 5 };

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Light
 */
//Most of the heavy lifting for realistic renders will be taken care of by the environment map.
const directionalLight = new THREE.DirectionalLight("#ffffff", 3);
directionalLight.castShadow = true;
directionalLight.position.set(0.25, 3, -2.25);
//This is needed because the far value of the shadow camera need not be further than the only visible object in the scene.
directionalLight.shadow.camera.far = 15;
//bias removes acne on flat surfaces, while normalBias helps for rounded ones
directionalLight.shadow.normalBias = 0.05;
scene.add(directionalLight);
gui
  .add(directionalLight, "intensity")
  .min(0)
  .max(10)
  .step(0.001)
  .name("lightIntensity");
gui
  .add(directionalLight.position, "x")
  .min(-5)
  .max(5)
  .step(0.001)
  .name("lightX");
gui
  .add(directionalLight.position, "y")
  .min(-5)
  .max(5)
  .step(0.001)
  .name("lightY");
gui
  .add(directionalLight.position, "z")
  .min(-5)
  .max(5)
  .step(0.001)
  .name("lightZ");
directionalLight.shadow.mapSize.set(1024, 1024);
// const directionalLightCameraHelper = new THREE.CameraHelper(
//   directionalLight.shadow.camera
// );
// scene.add(directionalLightCameraHelper);

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
camera.position.set(4, 1, -4);
scene.add(camera);

/**
 * Loaders
 */
const gltfLoader = new GLTFLoader();
//For updating materials to use envMap to lighten themselves.
const updateAllMaterials = () => {
  scene.traverse((child) => {
    //Only apply envMap to materials, not lights, camera, etc.
    if (
      child instanceof THREE.Mesh &&
      child.material instanceof THREE.MeshStandardMaterial
    ) {
      child.material.envMap = environmentMap;
      child.material.envMapIntensity = debugObject.envMapIntensity;
      child.material.needsUpdate = true;
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
};
gltfLoader.load("/models/hamburger.glb", (gltf) => {
  gltf.scene.scale.set(0.3, 0.3, 0.3);
  gltf.scene.position.set(0, -1, 0);
  gltf.scene.rotation.y = Math.PI * 0.5;
  scene.add(gltf.scene);
  updateAllMaterials();
  gui
    .add(gltf.scene.rotation, "y")
    .min(-Math.PI)
    .max(Math.PI)
    .step(0.001)
    .name("rotation");
});
gui
  .add(debugObject, "envMapIntensity")
  .min(0)
  .max(10)
  .step(0.001)
  .onChange(() => updateAllMaterials());

/**
 * Environment map
 */
const cubeTextureLoader = new THREE.CubeTextureLoader();
//Textures that we can see should be sRGBEncoding, else LinearEncoding (for realism).
//The GLTFLoader have this rule implemented automatically.
const environmentMap = cubeTextureLoader.load([
  "/textures/environmentMaps/0/px.jpg",
  "/textures/environmentMaps/0/nx.jpg",
  "/textures/environmentMaps/0/py.jpg",
  "/textures/environmentMaps/0/ny.jpg",
  "/textures/environmentMaps/0/pz.jpg",
  "/textures/environmentMaps/0/nz.jpg",
]);
environmentMap.encoding = sRGBEncoding;
scene.background = environmentMap;

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
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.physicallyCorrectLights = true;
//Refer to gamma vs linear colorspace notes for more details
renderer.outputEncoding = THREE.sRGBEncoding;
/**
 * For many HDR images, the dynamic range within is usually too high to be displayed on monitors,
 * for example, an HDR photo can have 100,000:1 dynamic range will need to under go tone maping so that the tonal values
 * fallbetween 1 and 255.
 *
 * In essence, tone mapping convert an HDR image into an LDR image.
 * Tone mapping is necessary because monitors are not capable of capturing all the details HDR has to offer,
 * tone mapping is there to help reduce the range from an HDR image while still keeping the realism that comes with HDR.
 * There are many mapping algorithms in THREEJS, each boasts their own unique aesthetics
 * https://skylum.com/blog/what-is-tone-mapping
 *
 * While our textures are not necessarily in HDR, applying tone mapping can help bringing the brightness of the scene down
 * and highlights the dark/light differences.
 */
renderer.toneMapping = THREE.ReinhardToneMapping;
gui
  .add(renderer, "toneMapping", {
    No: THREE.NoToneMapping,
    Linear: THREE.LinearToneMapping,
    Reinhard: THREE.ReinhardToneMapping,
    Cineon: THREE.CineonToneMapping,
    ACESFilmic: THREE.ACESFilmicToneMapping,
  })
  .onFinishChange(() => {
    renderer.toneMapping = Number(renderer.toneMapping);
    //Needed to apply toneMapping to materials, else only envMap will have toneMapping applied.
    updateAllMaterials();
  });
renderer.toneMappingExposure = 3;
gui.add(renderer, "toneMappingExposure").min(0).max(10).step(0.001);

/**
 * Animate
 */
const tick = () => {
  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();

/**
 * Other possible modifications: make sure direcitonaLight mathces the lighting of the environment.
 */
