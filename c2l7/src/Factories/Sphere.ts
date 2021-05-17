import * as THREE from "three";
import CANNON from "cannon";

/**
 * Get threejs and cannonjs spheres.
 *
 * No need to pass threejs geometry and material.
 */
export class SphereFactory {
  radius: number;
  position: THREE.Vector3;
  envMap: THREE.CubeTexture;
  physicsMaterial: CANNON.Material;
  scene: THREE.Scene;
  world: CANNON.World;

  material: THREE.MeshStandardMaterial;
  geometry: THREE.SphereGeometry;

  constructor(
    initialRadius: number,
    initialPosition: THREE.Vector3,
    envMap: THREE.CubeTexture,
    physicsMaterial: CANNON.Material,
    scene: THREE.Scene,
    world: CANNON.World
  ) {
    this.radius = initialRadius;
    this.position = initialPosition;
    this.envMap = envMap;
    this.physicsMaterial = physicsMaterial;
    this.scene = scene;
    this.world = world;
  }

  getSpheresAndAddToScene(newPosition?: THREE.Vector3, newRadius?: number) {
    //THREE.js

    const position = newPosition ? newPosition : this.position;
    const radius = newRadius ? newRadius : this.radius;

    this.geometry = new THREE.SphereGeometry(1, 20, 20);
    this.material = new THREE.MeshStandardMaterial({
      metalness: 0.3,
      roughness: 0.4,
      envMap: this.envMap,
    });

    const threeMesh = new THREE.Mesh(this.geometry, this.material);
    threeMesh.scale.set(radius, radius, radius);
    threeMesh.castShadow = true;
    threeMesh.position.copy(position);

    //CANNON.js
    const cannonShape = new CANNON.Sphere(radius);
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
