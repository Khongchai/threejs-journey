import * as THREE from "three";
export function getMoonLight() {
  const moonLight = new THREE.DirectionalLight("#b9d5ff", 0.12);
  moonLight.position.set(4, 5, -2);

  moonLight.castShadow = true;
  moonLight.shadow.mapSize.width = 256;
  moonLight.shadow.mapSize.height = 256;
  moonLight.shadow.camera.far = 15;

  return moonLight;
}
