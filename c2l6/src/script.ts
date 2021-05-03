import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";
import { CustomRaycaster } from "./raycaster/CustomRaycaster";
import { HoverEventsMonitor } from "./mouseEventsMonitor/HoverEventsMonitor";

/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl") as HTMLCanvasElement;
if (!canvas) throw new Error("Cannot find canvas HTML element");

// Scene
const scene = new THREE.Scene();

/**
 * Objects
 */
const object1 = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 16, 16),
  new THREE.MeshBasicMaterial({ color: "#ff0000" })
);
object1.position.x = -2;

const object2 = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 16, 16),
  new THREE.MeshBasicMaterial({ color: "#ff0000" })
);

const object3 = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 16, 16),
  new THREE.MeshBasicMaterial({ color: "#ff0000" })
);
object3.position.x = 2;

scene.add(object1, object2, object3);

/**
 * Raycaster
 */
const raycaster = new CustomRaycaster();
scene.add(raycaster as any);

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
camera.position.z = 3;
scene.add(camera);

/**
 * Mouse
 */
const mouse = new THREE.Vector2();
window.addEventListener("mousemove", (e) => {
  mouse.x = (e.clientX / sizes.width) * 2 - 1;
  mouse.y = -(e.clientY / sizes.height) * 2 + 1;
});

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

/**
 * MouseEvents
 */
const hoverEventsMonitor = new HoverEventsMonitor(
  "outside",
  [object1, object2, object3],
  camera
);

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  /*  //Cast a ray
  const rayOrigin = new THREE.Vector3(-3, 0, 0);
  const rayDirection = new THREE.Vector3(1, 0, 0);
  //Not necessary right now, because the length is already 1,
  //but still a good practice to keep the normalize() just in case.
  rayDirection.normalize();
  raycaster.set(rayOrigin, rayDirection);
  */

  hoverEventsMonitor.checkHoverEvents(mouse);
  const hoverData = hoverEventsMonitor.getAllHoverData();

  // if (intersects.length) {
  //   if (prevMouseState === "outside") {
  //     console.log("mouse enter");
  //     prevMouseState = "inside";
  //   }
  // } else if (prevMouseState === "inside" && !intersects.length) {
  //   console.log("mouse leave");
  //   prevMouseState = "outside";
  // }

  //for in is more performant than for of
  //Set default color
  for (let i = 0; i < hoverData.allCheckedObjects.length; i++) {
    (hoverData.allCheckedObjects[i] as any).material.color.set("red");
    canvas.style.cursor = "auto";
  }

  //Set intersect color
  for (let i = 0; i < hoverData.hoveredObjects.length; i++) {
    (hoverData.hoveredObjects as any)[i].object.material.color.set("blue");
    canvas.style.cursor = "pointer";
  }

  const hoverState = hoverData.hoverState;
  if (hoverState === "mouseenter") {
    console.log(hoverData.hoveredObjects);
  }
  //...

  //Simulate mouse enter and mouse leave
  //Animate Objects
  object1.position.y = Math.sin(elapsedTime * 0.3) * 1.5;
  object2.position.y = Math.sin(elapsedTime * 0.8) * 1.5;
  object3.position.y = Math.sin(elapsedTime * 1.4) * 1.5;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
