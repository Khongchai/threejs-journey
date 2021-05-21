import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";

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
 * Models
 */
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("draco/");
const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);
gltfLoader.load(
  "/models/Duck/glTF-Draco/Duck.gltf",
  (gltf) => {
    //In the gltf scene, each 3d element is treated as a children of a scene
    //similar to what happens in getElementsByClassName function, when iterating
    //through the loop and adding each of the gltf's child to threejs scene, it immediately
    //gets removed from the gltf one.
    //This means that for every iteration, the object that is being added is removed, the one after
    //it comes into its plane and then the pointer moves instead of to the item next to the one being removed,
    //it moves one more to the one after that. There will always be something left that didn't get added to threejs scene.
    // for (const child of gltf.scene.children) {
    //   scene.add(child);
    // }
    //What we can do is get only the first element and loop until there is nothing left in the array.
    /* while (gltf.scene.children.length) {
      scene.add(gltf.scene.children[0]);
    } */
    //Or we can try the native js solution
    /**
     * const children = [...gltf.scene.children]
     * for (const child of children)
     * {
     *   scene.add(children)
     * }
     */
    //Or we can just simply add the scene
    //scene.add(gltf.scene);
  },
  (progress) => {
    // console.log("progress");
    // console.log(progress);
  },
  (error) => {
    // console.error(error);
  }
);
let mixer = null;
gltfLoader.load(
  "models/Fox/glTF/Fox.gltf",
  (gltf) => {
    //The fox model is a bit too large, however, we shouldn't scale the model.
    //Instead, we'll scale the scene that contains the fox!
    const scaleVal = 0.025;
    gltf.scene.scale.set(scaleVal, scaleVal, scaleVal);

    //an object of AnimationMixer class contains all animations o f AnimationClip class associated with a nobject.
    //The line below tells the mixer to get all the animation data from the scene
    mixer = new THREE.AnimationMixer(gltf.scene);
    //The line below plays the animation passed as argument.
    const action = mixer.clipAction(gltf.animations[1]);
    action.play();

    scene.add(gltf.scene);
    console.log(gltf);
  },
  (progress) => {
    console.log("Progress: ", progress);
  },
  (error) => console.error(error)
);

/**
 * Floor
 */
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 10),
  new THREE.MeshStandardMaterial({
    color: "#444444",
    metalness: 0,
    roughness: 0.5,
  })
);
floor.receiveShadow = true;
floor.rotation.x = -Math.PI * 0.5;
scene.add(floor);

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.camera.left = -7;
directionalLight.shadow.camera.top = 7;
directionalLight.shadow.camera.right = 7;
directionalLight.shadow.camera.bottom = -7;
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

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
camera.position.set(2, 2, 2);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.target.set(0, 0.75, 0);
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

/**
 * Animate
 */
const clock = new THREE.Clock();
let previousTime = 0;

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - previousTime;
  previousTime = elapsedTime;

  if (mixer) {
    mixer.update(deltaTime);
  }

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
