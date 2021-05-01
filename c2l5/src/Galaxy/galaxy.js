import * as THREE from "three";

let geometry;
let material;
let points;
export const generateGalaxyAndAddToScene = (params, scene) => {
    //Destroy old galaxy
    if (points)
    {
        geometry.dispose();
        material.dispose();
        scene.remove(points);
    }

    /**
     * Geometry
     */
    geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(params.count * 3);

    for (let i = 0; i < params.count; i++)
    {
        //Randomize all the position of all vertices.
        const xVertex = i*3;
        const radius = Math.random() * params.radius;
        /**
         * Modulo = get angle; 3 = 3 modulo possibilities, so 3 angles.
         * Division by params.branches = get value getween 0 to 1
         * Times 2pi = expand all angle to full circle
         * Math.cos(branchAngle) => when the same number is put into cos and sin of different axis, the result is a circle.
         */
        const branchAngle = (i % params.branches) / params.branches * Math.PI * 2;
        const spinAngle = radius * params.spin;

        const randomX = (Math.random() - 0.5) * params.randomness * radius
        const randomY = (Math.random() - 0.5) * params.randomness * radius
        const randomZ = (Math.random() - 0.5) * params.randomness * radius

        positions[xVertex] = Math.cos(branchAngle + spinAngle) * radius + randomX;
        positions[xVertex + 1] = randomY;
        positions[xVertex + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;  
}

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    /**
     * Material
     */
    material = new THREE.PointsMaterial({
        size: params.size,
        sizeAttenuation: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
    });

    /**
     * Points
     */
    points = new THREE.Points(geometry, material);
    scene.add(points);
}