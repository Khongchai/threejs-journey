import "./style.css";
import * as three from "three";
import * as dat from "dat.gui";

//From prev 2 lessons

/**
 * When it comes to computer graphics, there are 4 ways of transforming an object:
 *  Position, scale, rotation, and quaternion.
 *
 * Any object that inherits from object3D in threejs has access to these 4 properties.
 */

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new three.Scene();

/**
 * Objects
 */
const geometry = new three.BoxGeometry(1, 1, 1);
const material = new three.MeshBasicMaterial({ color: 0xff0000 });
const mesh = new three.Mesh(geometry, material);
const mesh2 = new three.Mesh(
  new three.BoxGeometry(1, 1, 1),
  new three.MeshBasicMaterial({ color: "blue" })
);
const mesh3 = new three.Mesh(
  new three.BoxGeometry(1, 2, 3),
  new three.MeshBasicMaterial({ color: "green" })
);
mesh3.position.y = -2;
const meshOptions = {
  rotX: 0,
  rotY: 0,
  rotZ: 0,
};
//Position can be set anywhere as long as it is before render.
/*
  When facing gimbal lock while using Euler, do mesh.position.setOrder("YZX or something");
*/
mesh.position.set(0.8, -0.5, 1);
//Distance between the object and the center of the screen.
//console.log(mesh.position.length());
scene.add(mesh);
scene.add(mesh2);
scene.add(mesh3);

const axesHelper = new three.AxesHelper(5);
scene.add(axesHelper);

/**
 * Sizes
 */
const sizes = {
  width: 800,
  height: 600,
};

/**
 * Camera
 */
const cameraOptions = {
  posX: 0,
  posY: 0,
  posZ: 3,
  rotX: 0,
  rotY: 0,
};
const camera = new three.PerspectiveCamera(75, sizes.width / sizes.height);
scene.add(camera);

//Group
const groupOptions = {
  rotY: 0,
  rotX: 0,
  posX: 0,
  posY: 0,
};
const group = new three.Group();
group.add(mesh);
group.add(mesh2);
group.add(mesh3);
scene.add(group);

let gui = new dat.GUI();
let cam = gui.addFolder("Camera");
cam.add(cameraOptions, "posY", 0, 10);
cam.add(cameraOptions, "posX", -3, 0, 0.04);
cam.add(cameraOptions, "rotY", -0.5, 0.5, 0.000001);
cam.open();
let obj = gui.addFolder("Object");
obj.add(meshOptions, "rotX", 0, Math.PI, 0.01);
obj.add(meshOptions, "rotY", 0, Math.PI, 0.01);
obj.add(meshOptions, "rotZ", 0, Math.PI, 0.01);
obj.open();
let gr = gui.addFolder("Group1");
gr.add(groupOptions, "rotY", 0, Math.PI, 0.01);
gr.add(groupOptions, "rotX", 0, Math.PI, 0.01);
gr.add(groupOptions, "posY", 0, Math.PI, 0.01);
gr.add(groupOptions, "posX", 0, Math.PI, 0.01);
gr.open();

//Distance between the scene and the camera
//console.log(mesh.position.distanceTo(camera.position));

/**
 * Renderer
 */
const renderer = new three.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);

const render = () => {
  requestAnimationFrame(render);

  camera.position.set(
    cameraOptions.posX,
    cameraOptions.posY,
    cameraOptions.posZ
  );
  mesh.rotation.set(meshOptions.rotX, meshOptions.rotY, meshOptions.rotZ);
  group.rotation.set(groupOptions.rotX, groupOptions.rotY, 0);
  group.position.set(groupOptions.posX, groupOptions.posY, 0);

  renderer.render(scene, camera);
};

render();
