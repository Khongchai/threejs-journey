import * as THREE from "three";
export function getMoonLight() {
  const moonLight = new THREE.DirectionalLight("#b9d5ff", 0.12);
  moonLight.position.set(4, 5, -2);
  return moonLight;
}
