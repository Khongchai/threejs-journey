import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { getParticles } from './Particles/Particles'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene();

/**
 * Particles
 */
const numberOfDots = 10000;
const particles = getParticles(numberOfDots);
scene.add(particles);

/**
 * test cube
 */
// const cube = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshBasicMaterial());
// scene.add(cube);


/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    //Note: this is not ideal, as it is O(n*h) where h is the length of the particles( not fun when particles length is million)
    //Threejs Points is great for particle effect, but for performant animation,
    //It's better to write our own custom shader.
    for (let i = 0; i < numberOfDots; i++)
    {
        /**
         * The vertices of the particles are stored in a one-dimensional array,
         * so in order to access each y value from [x, y, z], we'll have to access
         * all numbers in that array who are multiples of 3. 
         * With 3-dimensional, we could have just done i[i][j][k].
         */
        const yIndex = (i*3) + 1;
        /**
         * To make a wave movment, we offset it by a value that would be different
         * for each of the member of the array, like their x value.
         */
        const xIndex = i*3;
        particles.geometry.attributes.position.array[yIndex] = Math.sin(
                elapsedTime + particles.geometry.attributes.position.array[xIndex]
                );
        particles.geometry.attributes.position.needsUpdate = true;
    }

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()