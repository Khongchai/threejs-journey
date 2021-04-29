import * as THREE from "three";

export function getGhosts() {
  const ghosts = new THREE.Group();
  const ghost1 = new THREE.PointLight("#ff00ff", 2, 3);
  ghost1.position.y = 20;
  ghosts.add(ghost1);

  const ghost2 = new THREE.PointLight("#00ffff", 2, 3);
  ghost2.position.y = 30;
  ghosts.add(ghost2);

  const ghost3 = new THREE.PointLight("#ffff00", 2, 3);
  ghosts.add(ghost3);

  ghost1.shadow.mapSize.width = 256;
  ghost1.shadow.mapSize.height = 256;
  ghost1.shadow.camera.far = 7;

  ghost2.shadow.mapSize.width = 256;
  ghost2.shadow.mapSize.height = 256;
  ghost2.shadow.camera.far = 7;

  ghost3.shadow.mapSize.width = 256;
  ghost3.shadow.mapSize.height = 256;
  ghost3.shadow.camera.far = 7;

  for (let i = 0; i < ghosts.children.length; i++) {
    ghosts.children[i].castShadow = true;
  }

  return ghosts;
}
