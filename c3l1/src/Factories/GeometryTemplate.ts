import * as THREE from "three";
import * as CANNON from "cannon-es";

type GeometryReturnType = {
  three: THREE.Mesh<THREE.BufferGeometry, THREE.Material>;
  cannon: CANNON.Body;
};
export abstract class GeometryTemplate {
  protected size: THREE.Vector3 | number;
  protected position: THREE.Vector3;
  protected envMap: THREE.Texture;
  protected physicsMaterial: CANNON.Material;
  protected scene: THREE.Scene;
  protected world: CANNON.World;
  protected material: THREE.MeshStandardMaterial;
  protected geometry: THREE.SphereGeometry;

  constructor(
    initialSize: THREE.Vector3 | number,
    initialPosition: THREE.Vector3,
    envMap: THREE.Texture,
    physicsMaterial: CANNON.Material,
    scene: THREE.Scene,
    world: CANNON.World
  ) {
    this.size = initialSize;
    this.position = initialPosition;
    this.envMap = envMap;
    this.physicsMaterial = physicsMaterial;
    this.scene = scene;
    this.world = world;
  }

  abstract getObjectsAndAddstoScene(
    newPosition?: THREE.Vector3,
    newSize?: THREE.Vector3 | number
  ): GeometryReturnType;
}
