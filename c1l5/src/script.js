import "./style.css";
import * as THREE from "three";

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
const scene = new THREE.Scene();

/**
 * Objects
 */
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const mesh = new THREE.Mesh(geometry, material);

//Position can be set anywhere as long as it is before render.
mesh.position.set(0.8, -0.5, 1);
//Distance between the object and the center of the screen.
//console.log(mesh.position.length());

scene.add(mesh);

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
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 3;
scene.add(camera);

//Distance between the scene and the camera
//console.log(mesh.position.distanceTo(camera.position));

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);
