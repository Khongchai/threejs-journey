import * as THREE from "three";
import * as CANNON from "cannon";

/**
 * Get threejs and cannonjs cubes.
 *
 * No need to pass threejs geometry and material.
 */
export class BoxFactory {
  envMap: THREE.CubeTexture;
  boxSizes: THREE.Vector3;
  position: THREE.Vector3;
  scene: THREE.Scene;
  world: CANNON.World;
  physicsMaterial: CANNON.Material;

  constructor(
    initialSize: THREE.Vector3,
    initialPosition: THREE.Vector3,
    envMap: THREE.CubeTexture,
    physicsMaterial: CANNON.Material,
    scene: THREE.Scene,
    world: CANNON.World
  ) {
    this.envMap = envMap;
    this.position = initialPosition;
    this.scene = scene;
    this.world = world;
    this.physicsMaterial = physicsMaterial;

    this.boxSizes = initialSize;
  }

  getBoxesAndAddToScene(
    newPosition?: THREE.Vector3,
    newBoxSizes?: THREE.Vector3
  ) {
    const sizes = newBoxSizes ? newBoxSizes : this.boxSizes;
    const halfExtents = {
      x: sizes.x * 0.5,
      y: sizes.y * 0.5,
      z: sizes.z * 0.5,
    };
    const position = newPosition ? newPosition : this.position;

    //Three
    const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
    const boxMaterial = new THREE.MeshStandardMaterial({
      metalness: 0.3,
      roughness: 0.4,
      envMap: this.envMap,
    });

    const threeMesh = new THREE.Mesh(boxGeometry, boxMaterial);
    threeMesh.scale.set(sizes.x, sizes.y, sizes.z);
    threeMesh.castShadow = true;
    threeMesh.position.copy(position);

    //Cannon
    const cannonShape = new CANNON.Box(
      new CANNON.Vec3(halfExtents.x, halfExtents.y, halfExtents.z)
    );
    const cannonBody = new CANNON.Body({
      mass: 1,
      shape: cannonShape,
      material: this.physicsMaterial,
    });
    cannonBody.position.copy(position as unknown as CANNON.Vec3);

    this.scene.add(threeMesh);
    this.world.addBody(cannonBody);

    return {
      three: threeMesh,
      cannon: cannonBody,
    };
  }
}
