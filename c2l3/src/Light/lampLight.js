import * as THREE from "three";
export function getScaryLight(x, y, z) {
  const doorLight = new THREE.PointLight("#ff7d46", 1, 7);
  doorLight.position.set(x, y, z);
  return doorLight;
}
