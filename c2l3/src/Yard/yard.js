import * as THREE from "three";

export function getYard(textureLoader) {
  const grassColorTexture = textureLoader.load("/textures/grass/color.jpg");
  const grassAmbientOcclusionTexture = textureLoader.load(
    "/textures/grass/ambientOcclusion.jpg"
  );
  const grassNormalTexture = textureLoader.load("/textures/grass/normal.jpg");
  const grassRoughnessTexture = textureLoader.load(
    "/textures/grass/roughness.jpg"
  );
  grassColorTexture.repeat.set(8, 8);
  grassAmbientOcclusionTexture.repeat.set(8, 8);
  grassNormalTexture.repeat.set(8, 8);
  grassRoughnessTexture.repeat.set(8, 8);
  grassColorTexture.wrapS = THREE.RepeatWrapping;
  grassAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping;
  grassNormalTexture.wrapS = THREE.RepeatWrapping;
  grassRoughnessTexture.wrapS = THREE.RepeatWrapping;

  grassColorTexture.wrapT = THREE.RepeatWrapping;
  grassAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping;
  grassNormalTexture.wrapT = THREE.RepeatWrapping;
  grassRoughnessTexture.wrapT = THREE.RepeatWrapping;

  const yard = new THREE.Group();
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.MeshStandardMaterial({
      map: grassColorTexture,
      aoMap: grassAmbientOcclusionTexture,
      normalMap: grassNormalTexture,
      roughnessMap: grassRoughnessTexture,
    })
  );
  ground.geometry.setAttribute(
    "uv2",
    new THREE.Float32BufferAttribute(ground.geometry.attributes.uv.array, 2)
  );
  ground.rotation.x = -Math.PI * 0.5;
  ground.position.y = 0;
  yard.add(ground);

  const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2);
  const graveMaterial = new THREE.MeshStandardMaterial({ color: "#b2b6b1" });
  for (let i = 0, graveAmount = 50; i < graveAmount; i++) {
    //Random angle from 0 to 2pi
    const angle = Math.random() * Math.PI * 2;
    //random radius from 3 to 6
    const radius = 3 + Math.random() * 6;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;

    //Create the mesh
    const grave = new THREE.Mesh(graveGeometry, graveMaterial);

    //Position
    grave.position.set(x, 0.3, z);

    // Rotation
    grave.rotation.z = (Math.random() - 0.5) * 0.4;
    grave.rotation.y = (Math.random() - 0.5) * 0.4;

    yard.add(grave);
  }
  return yard;
}
