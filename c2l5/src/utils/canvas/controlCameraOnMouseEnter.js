import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { sizes } from "../../script";
import gsap from "gsap";

let initialX = 0;

/**
 * @param {HTMLCanvasElement} canvas
 * @param {THREE.Camera} camera
 * @param {OrbitControls} controls
 * @param {sizes} sizes
 */
export function controlCamereaOnMouseEnter(canvas, camera, controls, sizes) {
  controls.enablePan = false;
  controls.rotateSpeed = 0.05;

  canvas.addEventListener("mouseenter", (e) => {
    initialX = camera.position.x;
  });

  canvas.addEventListener("mousemove", (e) => {
    controlRotateWithMouseMove(e, camera, sizes);
  });

  canvas.addEventListener("mouseleave", () => {
    gsap.to(camera.position, {
      duration: 0.1,
    });

    console.log(initialX);
  });
}

function controlRotateWithMouseMove(e, camera, sizes) {
  return gsap.to(camera.position, {
    x: ((e.clientX / sizes.width) * 2 - 1) * 0.5 + initialX,
    ease: "elastic",
  });
}
