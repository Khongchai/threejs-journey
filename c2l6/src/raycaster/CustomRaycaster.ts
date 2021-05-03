import * as THREE from "three";

export class CustomRaycaster extends THREE.Raycaster {
  private rayOrigin: THREE.Vector3 | undefined;
  private rayDirection: THREE.Vector3 | undefined;

  constructor() {
    super();
    // this.rayOrigin = new THREE.Vector3(-3, 0, 0);
    // this.rayDirection = new THREE.Vector3(10, 0, 0);
    // this.rayDirection.normalize();

    // this.raycaster.set(this.rayOrigin, this.rayDirection);
  }
}
