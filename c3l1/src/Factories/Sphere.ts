import * as THREE from "three";
import * as CANNON from "cannon-es";
import { playHitSound } from "../Sounds/playHitSound";
import { GeometryTemplate } from "./GeometryTemplate";

/**
 * Get threejs and cannonjs spheres.
 *
 * No need to pass threejs geometry and material.
 */
export class SphereFactory extends GeometryTemplate {
  constructor(
    initialRadius: number,
    initialPosition: THREE.Vector3,
    envMap: THREE.Texture,
    physicsMaterial: CANNON.Material,
    scene: THREE.Scene,
    world: CANNON.World
  ) {
    super(
      initialRadius,
      initialPosition,
      envMap,
      physicsMaterial,
      scene,
      world
    );
  }

  getObjectsAndAddstoScene(newPosition?: THREE.Vector3, newSize?: number) {
    //THREE.js

    const position = newPosition ? newPosition : this.position;
    const radius: number =
      typeof newSize === "number" ? newSize : (this.size as number);

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
    cannonBody.addEventListener("collide", playHitSound);

    this.scene.add(threeMesh);
    this.world.addBody(cannonBody);

    return {
      three: threeMesh,
      cannon: cannonBody,
    };
  }
}
