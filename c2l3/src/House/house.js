import * as THREE from "three";
import { DoubleSide } from "three";
import { getScaryLight } from "../Light/lampLight";

export function getHouse(textureLoader) {
  const house = new THREE.Group();
  house.castShadow = true;
  house.receiveShadow = true;

  /**
   * Textures
   */
  const bricksAOII = textureLoader.load(
    "/textures/bricksII/Brick_Wall_019_ambientOcclusion.jpg"
  );
  const bricksColorII = textureLoader.load(
    "/textures/bricksII/Brick_Wall_019_basecolor.jpg"
  );
  const bricksHeightII = textureLoader.load(
    "/textures/bricksII/Brick_Wall_019_basecolor.jpg"
  );
  const bricksNormalII = textureLoader.load(
    "/textures/bricksII/Brick_Wall_019_normal.jpg"
  );
  const bricksRoughnessII = textureLoader.load(
    "/textures/bricksII/Brick_Wall_019_roughness.jpg"
  );
  const doorColorTexture = textureLoader.load("/textures/door/color.jpg");
  const doorAlphaTexture = textureLoader.load("/textures/door/alpha.jpg");
  const doorAmbientOcclusionTexture = textureLoader.load(
    "/textures/door/ambientOcclusion.jpg"
  );
  const doorHeightTexture = textureLoader.load("/textures/door/height.jpg");
  const doorNormalTexture = textureLoader.load("/textures/door/normal.jpg");
  const doorMetalnessTexture = textureLoader.load(
    "/textures/door/metalness.jpg"
  );
  const doorRoughnessTexture = textureLoader.load(
    "/textures/door/roughness.jpg"
  );
  const bricksColorTexture = textureLoader.load("/textures/bricks/color.jpg");
  const bricksAmbientOcclusionTexture = textureLoader.load(
    "/textures/bricks/ambientOcclusion.jpg"
  );
  const bricksNormalTexture = textureLoader.load("/textures/bricks/normal.jpg");
  const bricksRoughnessTexture = textureLoader.load(
    "/textures/bricks/roughness.jpg"
  );
  /**
   * Walls
   */
  const walls = new THREE.Mesh(
    new THREE.BoxGeometry(4, 2.5, 4),
    new THREE.MeshStandardMaterial({
      map: bricksColorTexture,
      aoMap: bricksAmbientOcclusionTexture,
      normalMap: bricksNormalTexture,
      roughnessMap: bricksRoughnessTexture,
    })
  );
  walls.geometry.setAttribute(
    "uv2",
    new THREE.Float32BufferAttribute(walls.geometry.attributes.uv.array, 2)
  );

  walls.position.y = walls.geometry.parameters.height / 2;
  house.add(walls);

  /**
   * Roof
   */
  const roof = new THREE.Mesh(
    new THREE.ConeGeometry(3.5, 1, 4),
    new THREE.MeshStandardMaterial({ color: "#b35f45" })
  );
  roof.rotation.y = Math.PI * 0.25;
  //prettier-ignore
  roof.position.y =
  walls.geometry.parameters.height + (roof.geometry.parameters.height / 2);
  house.add(roof);

  /**
   * Door
   */
  const door = new THREE.Mesh(
    new THREE.PlaneGeometry(2.2, 2.2, 100, 100),
    new THREE.MeshStandardMaterial({
      map: doorColorTexture,
      transparent: true,
      alphaMap: doorAlphaTexture,
      aoMap: doorAmbientOcclusionTexture,
      displacementMap: doorHeightTexture,
      displacementScale: 0.1,
      normalMap: doorNormalTexture,
      metalnessMap: doorMetalnessTexture,
      roughnessMap: doorRoughnessTexture,
    })
  );
  door.geometry.setAttribute(
    "uv2",
    new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array, 2)
  );
  door.position.y = door.geometry.parameters.height / 2;
  //prettier-ignore
  //0.01 is to prevent z-fighting; basically set explicitly which one is on top
  door.position.z = (walls.geometry.parameters.depth / 2) + 0.01;
  const doorLight = getScaryLight(0, 2.2, 2.7);
  house.add(door, doorLight);

  /**
   * Windows
   */
  const windowLeft = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1),
    new THREE.MeshStandardMaterial({
      color: "lightblue",
      roughness: 0.4,
      side: DoubleSide,
    })
  );
  windowLeft.position.x = walls.geometry.parameters.width / 2 + 0.01;
  //prettier-ignore
  windowLeft.position.y =
    door.geometry.parameters.height - (windowLeft.geometry.parameters.height / 2);

  windowLeft.rotation.y = Math.PI / 2;
  const windowRight = windowLeft.clone();
  windowRight.position.x = -windowLeft.position.x;
  house.add(windowLeft, windowRight);

  /**
   * Chimney
   */
  const chimney = new THREE.Mesh(
    new THREE.BoxGeometry(1, 3, 1, 100, 100),
    new THREE.MeshStandardMaterial({
      map: bricksColorII,
      aoMap: bricksAOII,
      aoMapIntensity: 1,
      normalMap: bricksNormalII,
      displacementMap: bricksHeightII,
      displacementScale: 0.0028,
      roughnessMap: bricksRoughnessII,

      transparent: true,
    })
  );
  chimney.geometry.setAttribute(
    "uv2",
    new THREE.Float32BufferAttribute(chimney.geometry.attributes.uv.array, 2)
  );
  chimney.position.y = walls.geometry.parameters.height;
  chimney.position.x = roof.geometry.parameters.radius / 2.5;
  house.add(chimney);

  /**
   * Bushes
   */
  //Instead of one geometry for each bush, we have all the bushes share 1 material. More performant this way.
  const bushGeometry = new THREE.SphereGeometry(1, 16, 16);
  const bushMaterial = new THREE.MeshStandardMaterial({ color: "#89c854" });

  const bush1 = new THREE.Mesh(bushGeometry, bushMaterial);
  bush1.castShadow = true;
  bush1.scale.set(0.5, 0.5, 0.5);
  bush1.position.set(0.8, 0.2, 2.2);

  const bush2 = new THREE.Mesh(bushGeometry, bushMaterial);
  bush2.castShadow = true;
  bush2.scale.set(0.25, 0.25, 0.25);
  bush2.position.set(1.4, 0.1, 2.1);

  const bush3 = new THREE.Mesh(bushGeometry, bushMaterial);
  bush3.castShadow = true;
  bush3.scale.set(0.4, 0.4, 0.4);
  bush3.position.set(-0.8, 0.1, 2.2);

  const bush4 = new THREE.Mesh(bushGeometry, bushMaterial);
  bush4.castShadow = true;
  bush4.scale.set(0.15, 0.15, 0.15);
  bush4.position.set(-1, 0.05, 2.6);

  house.add(bush1, bush2, bush3, bush4);
  return house;
}
