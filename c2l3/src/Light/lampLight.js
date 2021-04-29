import * as THREE from "three";
export function getScaryLight(x, y, z) {
  const lampLight = new THREE.PointLight("#ff7d46", 1, 7);
  lampLight.position.set(x, y, z);

  lampLight.shadow.mapSize.width = 256;
  lampLight.shadow.mapSize.height = 256;
  lampLight.shadow.camera.far = 7;
  lampLight.castShadow = true;

  return lampLight;
}
