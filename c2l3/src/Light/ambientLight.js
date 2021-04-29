import * as THREE from "three";

export function getAmbientLight() {
  const ambientLight = new THREE.AmbientLight("#b8d5ff", 0.12);
  ambientLight.castShadow = true;
  return ambientLight;
}
