import * as THREE from "three";
import { MeshBasicMaterial } from "three";

export function getParticles(numberOfDots)
{
    /**
     * Creating particles is like creating a Mesh, 
     * you will need a geometry(can be the basic ones or created from scratch from BufferGeometry)
     * a material, in this case, PointsMaterial (or create your own) 
     * And a Points instance(instead of a Mesh) 
     */

    //Geometries
    const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
    const customGeometry = getCustomGeometry(numberOfDots, 10);

    //Textures
    const textureLoader = new THREE.TextureLoader();
    const particleTexture = textureLoader.load('/textures/particles/2.png');

    //Material
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.1,
        vertexColors: true,
        //this main color gets combined with the vertexColors
        color: new THREE.Color('#ff88cc'),
        alphaMap: particleTexture,
        transparent: true,
        //Don't really understand, but works.
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        //alphaTest: 0.01, <= do not render anything with opacity below this value.
        //depthTest: false, <= test if what's being drawn is closer to what's already drawn, can create problems with other materials.
        /**
         * If distance particles should be smaller than close ones
         */
        sizeAttenuation: true
    });
    //Using mesh will show that groups of three vertices are actually connecting several triangles. 
    // //By using PointsMaterial and THREE.Points, we are hiding the sides of the triangles and showing only the vertices.
    // const basicMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });
    // const particles = new THREE.Mesh(customGeometry, basicMaterial);

    //Points
    const particles = new THREE.Points(customGeometry, particlesMaterial);
    
    return particles;
}

function getCustomGeometry(numberOfDots, sizeMultiplier)
{
    //Geometry
    const particlesGeometry = new THREE.BufferGeometry();

    const count = numberOfDots;
    //3 is from [x, y, z ]
    const verticesInATriangle = 3;
    const allVertices = count * verticesInATriangle;

    const positions = new Float32Array(allVertices);
    const colors = new Float32Array(allVertices);

    for (let i = 0; i < allVertices; i++)
    {
        positions[i] = (Math.random() - 0.5) * sizeMultiplier;
        colors[i] = Math.random();
    }

    particlesGeometry.setAttribute('position', 
        //second argument is the dimension, 2 = plane, 1 = straight line
        new THREE.BufferAttribute(positions, verticesInATriangle));
    particlesGeometry.setAttribute('color', 
        //second argument is the dimension, 2 = plane, 1 = straight line
        new THREE.BufferAttribute(colors, verticesInATriangle));

    return particlesGeometry;
}