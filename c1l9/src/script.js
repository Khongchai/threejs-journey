import "./style.css";
import * as three from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new three.Scene();

// Object from threejs library
const geometry = new three.SphereGeometry(1, 100, 50);
const material = new three.MeshBasicMaterial({
  color: 0xff0000,
  wireframe: true,
});
const mesh = new three.Mesh(geometry, material);
scene.add(mesh);

/*
Custom Geometry 1
*/
//Empty BufferGeometry
const customGeometry = new three.BufferGeometry();
// prettier-ignore
//Create a Float32Array containing the vertices position (3 by 3)
const positionsArray = new Float32Array([
    0, 0, 0, //x, y, z for first vertext
    0, 1, 0, // for second
    1, 0, 0, // for third
]);
//Create the attribute and name it 'position'
//second value = how many values make 1 vertex attribute
const positionsAttribute = new three.BufferAttribute(positionsArray, 3);
//'position' is used because threejs's internal shader will look for that value.
customGeometry.setAttribute("position", positionsAttribute);
const material2 = new three.MeshBasicMaterial({
  color: 0xff0000,
  wireframe: true,
});
const mesh2 = new three.Mesh(customGeometry, material2);
mesh2.position.x += 2;
scene.add(mesh2);

/*
Custom Geometry 2
*/
const customGeometry2 = new three.BufferGeometry();
const count = 50;
const totalVertices = count * 3 * 3;
const positionsArray2 = new Float32Array(totalVertices);
for (let i = 0; i < totalVertices; i++) {
  positionsArray2[i] = (Math.random() - 0.5) * 4;
}
const positionsAttribute2 = new three.BufferAttribute(positionsArray2, 3);
customGeometry2.setAttribute("position", positionsAttribute2);
const mesh3 = new three.Mesh(customGeometry2, material2);
mesh3.position.x -= 3;
scene.add(mesh3);

// Sizes
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

// Camera
const camera = new three.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.z = 3;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

//dat.gui
const sphereOptions = {
  widthSeg: 10,
  heightSeg: 10,
};

// Renderer
const renderer = new three.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Animate
const clock = new three.Clock();

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
