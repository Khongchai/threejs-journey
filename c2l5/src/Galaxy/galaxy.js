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
     * The mixedColor value is based on how far a particle is from its center,
     * in other words, the larger the radius, the closer to the colorInside value
     * it becomes.
     *
     * Lerp (linear interpolation) takes a value between 0 and 1.
     * lerp method for Color https://threejs.org/docs/?q=color#api/en/math/Color
     */
    const mixedColor = colorInside.clone();
    mixedColor.lerp(colorOutside, radius / parameters.radius);

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
    positions[xVertex] =
      Math.cos(branchAngle + spinAngle) * radius +
      randomX +
      disperseIfMiddle(radius, parameters.radius, "x");
    positions[xVertex + 1] = randomY;
    positions[xVertex + 2] =
      Math.sin(branchAngle + spinAngle) * radius +
      randomZ +
      disperseIfMiddle(radius, parameters.radius, "y");

    colors[xVertex] = mixedColor.r;
    colors[xVertex + 1] = mixedColor.g;
    colors[xVertex + 2] = mixedColor.b;
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

/**
 *
 * @param {number} randomizedRadius
 * @param {number} originalRadius
 * If randomized radius turns out to be less than 10% of the original radius's length,
 * disperse the value randomly inside the middle's circle, else returns 1.
 *
 */
//NOT DONE
function disperseIfMiddle(randomizedRadius, originalRadius, axis) {
  //value of middlePosition is arbitrary, can be anywhere that feels kind of "in the middle".
  const middleCircleRadius = 0.1 * originalRadius;
  const middleCircleArea = (Math.PI * middleCircleRadius) ** 2;
  const randomPositionInTheCircle =
    axis === "y"
      ? Math.sin(Math.random() * Math.PI * 2) * middleCircleRadius
      : Math.cos(Math.random() * Math.PI * 2) * middleCircleRadius;
  if (randomizedRadius < middleCircleRadius) {
    return randomPositionInTheCircle;
  }
  return 1;
}
