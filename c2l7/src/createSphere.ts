import * as THREE from "three";
import CANNON from "cannon";

/**
 * Get threejs and cannonjs spheres 
 */
export class SpheresFactory{
    radius: number;
    position: THREE.Vector3;
    envMap: THREE.CubeTexture;
    physicsMaterial: CANNON.Material;
    scene: THREE.Scene;
    world: CANNON.World;

    material: THREE.MeshStandardMaterial;
    geometry: THREE.SphereGeometry;

    constructor(radius: number, position: THREE.Vector3, envMap: THREE.CubeTexture, 
                physicsMaterial: CANNON.Material, scene: THREE.Scene, world: CANNON.World)
    {
        this.radius = radius;
        this.position = position;
        this.envMap = envMap;
        this.physicsMaterial = physicsMaterial;
        this.scene = scene;
        this.world = world;

        this.geometry = new THREE.SphereGeometry(1, 20, 20);
        this.material = new THREE.MeshStandardMaterial({metalness: 0.3, roughness: 0.4, envMap: this.envMap});
    }

    getSpheresAndAddToScene(newPosition?: THREE.Vector3, newRadius?: number)
    {
        //THREE.js

       const mesh = new THREE.Mesh(
            this.geometry, this.material
        );
        if (newRadius)
        {
            mesh.scale.set(newRadius, newRadius, newRadius)
        }
        mesh.castShadow = true;
        const position = newPosition? newPosition: this.position;
        mesh.position.copy(position);

        //CANNON.js
        const shape = new CANNON.Sphere(this.radius);
        const body = new CANNON.Body({
            mass: 1,
            position: new CANNON.Vec3(0,3,0),
            shape: shape, 
            material: this.physicsMaterial 
        })

        body.position.copy(position as unknown as CANNON.Vec3);

        this.scene.add(mesh);
        this.world.addBody(body);

        return {
            three: mesh,
            cannon: body, 
        }
    }

}
