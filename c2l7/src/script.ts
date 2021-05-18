import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";
import * as CANNON from "cannon-es";
import { SphereFactory } from "./Factories/Sphere";
import { BoxFactory } from "./Factories/Box";
import { playHitSound } from "./Sounds/playHitSound";

/**
 * Idea: physics world of threejs is an alternate world that we cannot see
 *  that mirrors what happens inside threejs.
 *  For example, when a box is created, its physics counter part is also created.
 * To update the box using physics, we tell the box to copy the coordinates and position
 * of its physics cousin.
 *
 * If what is being built can be represented with 2d physics like http://letsplay.ouigo.com/
 * you are much better off using 2d libraries.
 * The most poular 2d physics libraries are:
 * Matter.js << good // P2.js // Planck.js // Box2D.js
 *
 * For 3d physics, there are three main libraries:
 * Ammo.js << most used // Cannon.js //Oimo.js << good for collisions
 *
 *
 */

/**
 * Debug
 */
const gui = new dat.GUI();

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl") as any;

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const cubeTextureLoader = new THREE.CubeTextureLoader();

const environmentMapTexture = cubeTextureLoader.load([
  "/textures/environmentMaps/0/px.png",
  "/textures/environmentMaps/0/nx.png",
  "/textures/environmentMaps/0/py.png",
  "/textures/environmentMaps/0/ny.png",
  "/textures/environmentMaps/0/pz.png",
  "/textures/environmentMaps/0/nz.png",
]);

/**
 * Physics
 */
const physicsWorld = new CANNON.World();
//Broadphase time complexities + other interesting details:
//  https://developer.nvidia.com/gpugems/gpugems3/part-v-physics-simulation/chapter-32-broad-phase-collision-detection-cuda#:~:text=In%20the%20broad%20phase%2C%20collision,set%20of%20pairs%20of%20objects.
//  https://github.com/mattleibow/jitterphysics/wiki/Sweep-and-Prune
physicsWorld.broadphase = new CANNON.SAPBroadphase(physicsWorld);
physicsWorld.gravity.set(0, -9.82, 0);
physicsWorld.allowSleep = true;

//CANNON.js' ContactMaterial; defines what happens when two materials meet (ex. when a ball falls down onto the floor).
//CANNON.js' Material is just a reference; this reference says that the properties of the contact material
//affect the interaction between objects that have these materials
const concreteMaterial = new CANNON.Material("concrete");
const plasticMaterial = new CANNON.Material("plastic");
const concretePlasticContactMaterial = new CANNON.ContactMaterial(
  concreteMaterial,
  plasticMaterial,
  {
    friction: 0.1,
    restitution: 0.7,
  }
);
physicsWorld.addContactMaterial(concretePlasticContactMaterial);
//Having different Mateirals and ContactMaterials for each combination can be
//difficult and impractical to manage. We can instead, create a default and use
//it for every Bodies for the sake of simplification
const defaultMaterial = new CANNON.Material("default");
const defaultContactMaterial = new CANNON.ContactMaterial(
  defaultMaterial,
  defaultMaterial,
  {
    friction: 0.1,
    restitution: 0.7,
  }
);
physicsWorld.addContactMaterial(defaultContactMaterial);
//We can also a contact material the default one for our world
physicsWorld.defaultContactMaterial = defaultContactMaterial;

//Bodies are objects that will fall and collide with other objects
//Shape determines the shape of that body
// const sphereShape = new CANNON.Sphere(0.5);
// const sphereBody = new CANNON.Body({
// mass: 1,
//Same position as the threejs sphere
// position: new CANNON.Vec3(0, 3, 0),
// shape: sphereShape,
//This line is no longer necessary with the world's default material applied.
// material: defaultMaterial,
// });
// physicsWorld.addBody(sphereBody);
//Better management: add a class that manages the creation of the spheres.
const randomGeometryProps = {
  radius: Math.random() * 0.5,
  position: {
    x: (Math.random() - 0.5) * 3,
    y: 3,
    z: (Math.random() - 0.5) * 3,
  },
  cubeDimensions: {
    x: Math.random(),
    y: Math.random(),
    z: Math.random(),
  },
};

let geometries: any[] = [];
const debugObject = {
  createSphere: function () {},
  createBox: function () {},
  reset: function () {
    for (const geometry of geometries) {
      //Remove cannon body
      geometry.cannon.removeEventListener("collide", playHitSound);
      physicsWorld.removeBody(geometry.cannon);

      //Remove threejs mesh
      scene.remove(geometry.three);
    }
  },
};
gui.add(debugObject, "reset");
/**
 * Spheres
 */
const sphereFactory = new SphereFactory(
  randomGeometryProps.radius,
  randomGeometryProps.position as THREE.Vector3,
  environmentMapTexture,
  defaultMaterial,
  scene,
  physicsWorld
);
//geometries.push(sphereFactory.getSpheresAndAddToScene());
debugObject.createSphere = () => {
  geometries.push(
    sphereFactory.getSpheresAndAddToScene(
      {
        x: (Math.random() - 0.5) * 3,
        y: 3,
        z: (Math.random() - 0.5) * 3,
      } as THREE.Vector3,
      Math.random() * 0.5
    )
  );
};
gui.add(debugObject, "createSphere");

/**
 * Boxes
 */
const boxFactory = new BoxFactory(
  randomGeometryProps.cubeDimensions as THREE.Vector3,
  randomGeometryProps.position as THREE.Vector3,
  environmentMapTexture,
  defaultMaterial,
  scene,
  physicsWorld
);
geometries.push(boxFactory.getBoxesAndAddToScene());
debugObject.createBox = () => {
  geometries.push(
    boxFactory.getBoxesAndAddToScene(
      {
        x: (Math.random() - 0.5) * 3,
        y: 3,
        z: (Math.random() - 0.5) * 3,
      } as THREE.Vector3,
      {
        x: Math.random(),
        y: Math.random(),
        z: Math.random(),
      } as THREE.Vector3
    )
  );
};
gui.add(debugObject, "createBox");

const floorShape = new CANNON.Plane();
const floorBody = new CANNON.Body();
//We don't want the floor to fall, so mass = 0;
floorBody.mass = 0;
floorBody.position.y = 0;
floorBody.addShape(floorShape);
//This line is no longer necessary with the world's default material applied.
// floorBody.material = defaultMaterial;
physicsWorld.addBody(floorBody);

floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), Math.PI * 0.5);

/**
 * Floor
 */
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 10),
  new THREE.MeshStandardMaterial({
    color: "#777777",
    metalness: 0.3,
    roughness: 0.4,
    envMap: environmentMapTexture,
  })
);
floor.receiveShadow = true;
floor.rotation.x = -Math.PI * 0.5;
scene.add(floor);

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.2);
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
camera.position.set(-3, 3, 3);
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
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();
let oldElapsedTime = 0;

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - oldElapsedTime;
  oldElapsedTime = elapsedTime;

  //Update physics
  //TODO: read more about this
  physicsWorld.step(1 / 60, deltaTime, 3);
  //After updating the physicsWorld, update the real world as well
  //Can be done by copying each coordinate separately, or like so:
  // sphere.position.copy((sphereBody.position as unknown) as Vector3);
  // sphereBody.applyForce(new CANNON.Vec3(-0.5, 0, 0), sphereBody.position);
  for (const geometry of geometries) {
    geometry.three.position.copy(
      geometry.cannon.position as unknown as THREE.Vector3
    );
    geometry.three.quaternion.copy(geometry.cannon.quaternion);
  }

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
