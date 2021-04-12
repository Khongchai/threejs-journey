import "./style.css";
import * as THREE from "three";
import gsap from "gsap";

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// Object
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// Sizes
const sizes = {
  width: 800,
  height: 600,
};

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 3;
scene.add(camera);

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);

/**
 *  Because requestAnimationFrame runs at different speed based on each
 *  screen's refresh rate, for example, 60fps, 60 times; 144 fps, 144times, etc.
 *  To make sure that an animation runs at a consistent speed on all screen,
 *  we can use the time method, or the built-in THREE.clock(); method.
 *
 *  Date.now() method:
 *      Takes the rate of change in milliseconds between current frame and prev "deltaTime" (in a 60fps screen, the rate of change is about 16),
 *      and multiply that with the desired value. DeltaTime will scale automatically, after 1000 milliseconds(1 second), the integral of delta time
 *      will be 1000. Refresh rate is constant, so the derivative is also constant.
 * 
 *      
        let time = Date.now();

        const tick = () => {
        const currentTime = Date.now();
        const deltaTime = currentTime - time;
        time = currentTime;

        mesh.rotation.y += 0.0002 * deltaTime;

        renderer.render(scene, camera);

        requestAnimationFrame(tick);
        };

        tick();

 * THREE.Clock() method:same thing, just different syntax. The value returned is not milliseconds, but seconds.
        const clock = new THREE.Clock();

        const tick = () => {
        const elapsedTime = clock.getElapsedTime();
        mesh.rotation.y += 0.0002 * elapsedTime;
        mesh.position.x = Math.tan(elapsedTime);
        mesh.position.y = Math.cos(elapsedTime);

        renderer.render(scene, camera);

        requestAnimationFrame(tick);
        };

        tick(); 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 *  
 * 
 * 
 * 
 *       
 *      
 *
 *
 *
 */

//Last method with a third party library.
//GSAP has a built-in requestAnimationFrame, so no need to update the animation.
//But to see it, we need to render every scene, hence the tick function.
gsap.to(mesh.position, { duration: 1, delay: 1, x: 2 });

const tick = () => {
  renderer.render(scene, camera);

  window.requestAnimationFrame(tick);
};

tick();
