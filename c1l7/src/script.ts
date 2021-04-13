import "./style.css";
import * as three from "three";
import * as dat from "dat.gui";
import { OrbitControls } from "three-orbitcontrols-ts";
/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");
// Sizes
const sizes = {
  width: 1000,
  height: 500,
};

// Scene
const scene = new three.Scene();

// Object
const desiredNumberOfExtraMeshes = 100;
const meshes: three.Mesh<three.BoxGeometry, three.MeshBasicMaterial>[] = [];
for (let i = 0; i < desiredNumberOfExtraMeshes; i++) {
  const mesh = new three.Mesh(
    new three.BoxGeometry(1, 1, 1, 5, 5, 5),
    new three.MeshBasicMaterial({ color: 0xff0000 })
  );
  mesh.position.x = Math.floor(Math.random() * 100);
  mesh.position.y = Math.floor(Math.random() * 250);
  mesh.position.z = Math.floor(Math.random() * 100);
  meshes.push(mesh);
  scene.add(mesh);
}
const mainMesh = new three.Mesh(
  new three.BoxGeometry(1, 1, 1, 5, 5, 5),
  new three.MeshBasicMaterial({ color: "green" })
);
scene.add(mainMesh);

//Cursor
const cursorPos = {
  x: 0,
  y: 0,
};
window.addEventListener("mousemove", (e) => {
  cursorPos.x = (e.clientX / sizes.width) * 2 - 1;
  cursorPos.y = -(e.clientY / sizes.height) * 2 + 1;
});

/**
 * GUI
 */
var gui = new dat.GUI();
var cameraFolder = gui.addFolder("Camera");
let cameraOptions = {
  fov: 75,
  aspectRatio: sizes.width / sizes.height,
  near: 1,
  far: 100,
};
cameraFolder.add(cameraOptions, "fov");
cameraFolder.add(cameraOptions, "aspectRatio");
cameraFolder.add(cameraOptions, "near", 1, 100, 0.01);
cameraFolder.add(cameraOptions, "far", 100, 1000, 0.01);
cameraFolder.open();
/**
 * Camera
 */
const camera = new three.PerspectiveCamera(
  cameraOptions.fov,
  cameraOptions.aspectRatio,
  cameraOptions.near,
  cameraOptions.far
);
camera.position.z = -3;
scene.add(camera);

/**
 * Extra: OrthographicCamera 
 * 
  
const aspectRatio = sizes.width / sizes.height
const camera = new THREE.OrthographicCamera(- 1 * aspectRatio, 1 * aspectRatio, 1, - 1, 0.1, 100)

 * 
 * 
 * 
 */

// Renderer
const renderer = new three.WebGLRenderer({
  canvas: canvas as any,
});
renderer.setSize(sizes.width, sizes.height);
//Move camera(OrbitControls class)
const controls = new OrbitControls(camera, canvas as HTMLElement);
controls.enableDamping = true;
controls.enableZoom = true;

// Animate
const clock = new three.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update objects
  for (let i = 0; i < desiredNumberOfExtraMeshes; i++) {
    meshes[i].rotation.y = elapsedTime;
  }

  //testing with dat.gui
  camera.far = cameraOptions.far;
  camera.near = cameraOptions.near;
  camera.fov = cameraOptions.fov;
  camera.updateProjectionMatrix();

  //Move camera(manual)
  /*   camera.position.x = Math.sin(cursorPos.x * Math.PI * 2) * 2;
  camera.position.z = Math.cos(cursorPos.x * Math.PI * 2) * 2;
  camera.position.y = cursorPos.y * 3; */
  //Move camera(OrbitControls)
  controls.update();

  /**
   * Chooes one random object to look at.
   */
  camera.lookAt(mainMesh.position);

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
