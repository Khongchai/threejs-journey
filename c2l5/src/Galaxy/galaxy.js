import * as THREE from "three";

let geometry;
let material;
let points;
export const generateGalaxyAndAddToScene = (parameters, scene) => {
  //Destroy old galaxy
  if (points) {
    geometry.dispose();
    material.dispose();
    scene.remove(points);
  }

  /**
   * Geometry
   */
  geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(parameters.count * 3);
  const colors = new Float32Array(parameters.count * 3);

  const colorInside = new THREE.Color(parameters.insideColor);
  const colorOutside = new THREE.Color(parameters.outsideColor);

  for (let i = 0; i < parameters.count; i++) {
    //Randomize all the position of all vertices.
    const xVertex = i * 3;
    const radius = Math.random() * parameters.radius;
    /**
     * Modulo = get angle; 3 = 3 modulo possibilities, so 3 angles.
     * Division by params.branches = get value getween 0 to 1
     * Times 2pi = expand all angle to full circle
     * Math.cos(branchAngle) => when the same number is put into cos and sin of different axis, the result is a circle.
     */
    const branchAngle =
      ((i % parameters.branches) / parameters.branches) * Math.PI * 2;
    const spinAngle = radius * parameters.spin;

    const randomX = getRandomVal(
      parameters.squeezePower,
      parameters.randomness,
      radius
    );
    const randomY = getRandomVal(
      parameters.squeezePower,
      parameters.randomness,
      radius
    );
    const randomZ = getRandomVal(
      parameters.squeezePower,
      parameters.randomness,
      radius
    );
    positions[xVertex] = Math.cos(branchAngle + spinAngle) * radius + randomX;
    positions[xVertex + 1] = randomY;
    positions[xVertex + 2] =
      Math.sin(branchAngle + spinAngle) * radius + randomZ;

    colors[xVertex] = 1;
    colors[xVertex + 1] = 0;
    colors[xVertex + 2] = 0;
  }

  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  /**
   * Material
   */
  material = new THREE.PointsMaterial({
    size: parameters.size,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true,
  });

  /**
   * Points
   */
  points = new THREE.Points(geometry, material);
  scene.add(points);
};

function getRandomVal(squeezePower, randomness, radius) {
  const randomVal = //Give random value between 0 and 1 raise it to the squeezePower
    //The bigger the squeezePower, the closer the value is to 0
    Math.random() ** squeezePower *
    //Expand the range from the above line to include negative values as well
    (Math.random() < 0.5 ? 1 : -1) *
    //Controls random placement
    //randomness basically help keeps the randomness value subtle
    randomness *
    radius;
  return randomVal;
}
