import "./style.css";
import * as THREE from "three";

/* From prev lesson */

/*
    Basic: 
    rendering a basic scene requires 
        a scene (duh), 
        objects, 
        a camera, 
        and a renderer.

    Camera:
        2 types, perspective and orthographic. Perspective is how the world is perceived in real life. 
        Orthographic, however, does not take into account the distance of objects, like old 2d games.

    Renderer:
        Can be created manually or automatically: https://threejs.org/docs/#api/en/renderers/WebGLRenderer
*/

const scene = new THREE.Scene();
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

const sizes = {
  width: 800,
  height: 600,
};

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
/*
    At this point, nothing will still be visible; all created objects are automatically centered.
    The camera is basically inside of the object, which won't really show us anything.
    This is fixed easily by moving the camera backward.

    Once the camera is created, it can be moved dynamically anytime anywhere. But the creation process
    has to happen before the rendering.
*/
camera.position.z = 3;
//Then add the camera to the scene
scene.add(camera);

const canvas = document.querySelector("canvas.webgl");

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);
