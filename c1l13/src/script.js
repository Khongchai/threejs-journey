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
 * Textures + materials
 */
const textureLoader = new THREE.TextureLoader();
const matcapTexture = textureLoader.load("/textures/matcaps/1.png");
const material = new THREE.MeshMatcapMaterial({ matcap: matcapTexture });

/*
 * Fonts
 */
const fontLoader = new THREE.FontLoader();
fontLoader.load("/fonts/helvetiker_regular.typeface.json", (font) => {
  const bevelSize = 0.02;
  const textGeometry = new THREE.TextGeometry("Hello Three.js", {
    font: font,
    size: 0.5,
    height: 0.2,
    curveSegments: 12,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize,
    bevelOffset: 0,
    bevelSegments: 15,
  });

  const text = new THREE.Mesh(textGeometry, material);
  textGeometry.computeBoundingBox();
  //centering the geometry (recall, text in premiere centers at the left most side, same here; we need to center it)
  textGeometry.translate(
    -(textGeometry.boundingBox.max.x - bevelSize) * 0.5,
    -(textGeometry.boundingBox.max.y - bevelSize) * 0.5,
    -(textGeometry.boundingBox.max.z - bevelSize) * 0.5
  );
  /**
   * All of the above can also be done like so: textGeometry.center();
   */
  scene.add(text);
});

/**
 * Object
 */
const donutAmount = 100;
const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45);
const donuts = new THREE.Group();
for (let i = 0; i < donutAmount; i++) {
  const donut = new THREE.Mesh(donutGeometry, material);
  donut.position.x = (Math.random() - 0.5) * 10;
  donut.position.y = (Math.random() - 0.5) * 10;
  donut.position.z = (Math.random() - 0.5) * 10;
  donut.rotation.x = Math.random() * Math.PI;
  donut.rotation.y = Math.random() * Math.PI;

  //same scaling value for all 3 axes
  const scale = Math.random();
  donut.scale.set(scale, scale, scale);

  donuts.add(donut);
}
scene.add(donuts);

const cube = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial()
);

// scene.add(cube);

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

  donuts.rotation.x += 0.01;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
