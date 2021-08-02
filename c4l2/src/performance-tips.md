# Monitoring:

we can use a bunch of monitoring methods. The simplest one would be stats.js

# Disable FPS limit

There is a way to unlock Chrome frame rate regardless of the screen capabilities.

That will enable frame rate monitoring even on good computers. For example, if you are developing on a good computer and you see 60fps, you might think it's okay. But maybe your website can only run at 70~80fps on that good computer, but the frame rate will drop below 60fps on other computers, and you won't know it.

If you unlock the frame rate limit, you'll see that the performances aren't good enough, and you should run at something like 150~200fps on this computer to be safe.

To unlock Chrome framerate:

Close it completely —write the following instructions somewhere else if you are looking at this lesson on Chrome.
Open the terminal.
Open the following Github gist and launch the right command —Mac or Windows: https://gist.github.com/brunosimon/c15e7451a802fa8e34c0678620022f7d
Chrome should open without the frame rate limit. You can test it on with the exercise by opening the FPS meter again. If it didn't work, close it and retry. If it still doesn't work, you'll have to do without it.

Be careful; doing this will draw much more power from your computer and might result on Chrome crashing.

# Monitoring Draw Calls

Use something like this chrome extension to monitor the draw calls of the gpu: https://chrome.google.com/webstore/detail/spectorjs/denbgaamihkadbghdceggmchnflmhpmk

# Renderer information

Calling

```js
console.log(renderer.info);
```

gives you info regarding the info the scene needs to render, like how many triangles there are in the scene, calls made, the amount of geometries in the scene, etc.

# Get rid of stuff

Once something does not need to be seen or used anymore in a scene, they should be disposed off. Threejs
does not free up memories automatically. Releasing the memories will have to be done through their API.

Docs: https://threejs.org/docs/#manual/en/introduction/How-to-dispose-of-objects

Code example:

```js
scene.remove(cube);
cube.geometry.dispose();
cube.material.dispose();
```

# Optimizing Shadow Maps

Shadows should generally be avoided. However, if you cannot avoid them, you should optimize them such that
they still look good but also does not take too much a toll on the performance.

Also, try using the camera helper to keep the shadow map just within the scene the user needs to see.

```js
directionalLight.shadow.camera.top = 3;
directionalLight.shadow.camera.right = 6;
directionalLight.shadow.camera.left = -6;
directionalLight.shadow.camera.bottom = -3;
directionalLight.shadow.camera.far = 10;

const cameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
scene.add(cameraHelper);
```

And try to use the smallest possible resolution with a descent result for the mapSize:

```js
directionalLight.shadow.mapSize.set(1024, 1024);
```

# Deactivate Shadow Auto Update

You can deactivate the shadow map and have it update only when necessary like so:

```js
renderer.shadowMap.autoUpdate = false;

//When needed, call
renderer.shadowMap.needsUpdate = true;
```

Disabling the autoUpdate right before calling needsUpdate outside the animate function would ensure that only one render for the shadow is made.

# Updating Vertices

If you need to do anything with the vertices, do it with the vertex shader for best performance.

# Mutualize and Merge Geometries

You can share a single geometry amongst many meshes:

```ts
const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);

for (let i = 0; i < 50; i++) {
  const material = new THREE.MeshNormalMaterial();

  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.x = (Math.random() - 0.5) * 10;
  mesh.position.y = (Math.random() - 0.5) * 10;
  mesh.position.z = (Math.random() - 0.5) * 10;
  mesh.rotation.y = (Math.random() - 0.5) * Math.PI * 2;
  mesh.rotation.z = (Math.random() - 0.5) * Math.PI * 2;

  scene.add(mesh);
}
```

Or even better, to make a single draw call for all geometries, you can do

```ts
const geometries = [];
for (let i = 0; i < 50; i++) {
  const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);

  geometry.rotateX((Math.random() - 0.5) * Math.PI * 2);
  geometry.rotateY((Math.random() - 0.5) * Math.PI * 2);

  geometry.translate(
    (Math.random() - 0.5) * 10,
    (Math.random() - 0.5) * 10,
    (Math.random() - 0.5) * 10
  );

  geometries.push(geometry);
}

const mergedGeometry = BufferGeometryUtils.mergeBufferGeometries(geometries);
console.log(mergedGeometry);

const material = new THREE.MeshNormalMaterial();

const mesh = new THREE.Mesh(mergedGeometry, material);
scene.add(mesh);
```

And of couse, you can share the materials as well.

```js
const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);

const material = new THREE.MeshNormalMaterial();

for (let i = 0; i < 50; i++) {
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.x = (Math.random() - 0.5) * 10;
  mesh.position.y = (Math.random() - 0.5) * 10;
  mesh.position.z = (Math.random() - 0.5) * 10;
  mesh.rotation.x = (Math.random() - 0.5) * Math.PI * 2;
  mesh.rotation.y = (Math.random() - 0.5) * Math.PI * 2;

  scene.add(mesh);
}
```

# Use InstancedMesh

While combining geometries like the method seen above is fine and very performant. It introduces a problem; we can no longer move the geometries independently.

To fix that, we need to use InstancedMesh

```js
const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
const material = new THREE.MeshNormalMaterial();

const mesh = new THREE.InstancedMesh(geometry, material, 50);
//This will allow the matrix to be change in the tick function
mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
scene.add(mesh);

for (let i = 0; i < 50; i++) {
  const position = new THREE.Vector3(
    (Math.random() - 0.5) * 10,
    (Math.random() - 0.5) * 10,
    (Math.random() - 0.5) * 10
  );

  const quaternion = new THREE.Quaternion();
  quaternion.setFromEuler(
    new THREE.Euler(
      (Math.random() - 0.5) * Math.PI * 2,
      (Math.random() - 0.5) * Math.PI * 2,
      0
    )
  );

  const matrix = new THREE.Matrix4();
  matrix.makeRotationFromQuaternion(quaternion);
  matrix.setPosition(position);

  mesh.setMatrixAt(i, matrix);
}
```

# Low Poly

Use low poly models where possible. Try to use normal maps in instead of the actual polygons. Normal maps are much cheaper.

# Use textures instead of functions

Sometimes, when you wanna create a cool noisy textures, might just be better to do something like this where you load a noise-looking texture instead of straight up using the perlin noise function.

```js
const shaderGeometry = new THREE.PlaneGeometry(10, 10, 256, 256);

const shaderMaterial = new THREE.ShaderMaterial({
  uniforms: {
    uDisplacementTexture: { value: displacementTexture },
    uDisplacementStrength: { value: 1.5 },
  },
  vertexShader: `
        uniform sampler2D uDisplacementTexture;
        uniform float uDisplacementStrength;

        varying vec2 vUv;

        void main()
        {
            vec4 modelPosition = modelMatrix * vec4(position, 1.0);

            float elevation = texture2D(uDisplacementTexture, uv).r;
            if(elevation < 0.5)
            {
                elevation = 0.5;
            }

            modelPosition.y += elevation * uDisplacementStrength;

            gl_Position = projectionMatrix * viewMatrix * modelPosition;

            vUv = uv;
        }
    `,
  fragmentShader: `
        uniform sampler2D uDisplacementTexture;

        varying vec2 vUv;

        void main()
        {
            float elevation = texture2D(uDisplacementTexture, vUv).r;
            if(elevation < 0.25)
            {
                elevation = 0.25;
            }

            vec3 depthColor = vec3(1.0, 0.1, 0.1);
            vec3 surfaceColor = vec3(0.1, 0.0, 0.5);
            vec3 finalColor = vec3(0.0);
            finalColor.r += depthColor.r + (surfaceColor.r - depthColor.r) * elevation;
            finalColor.g += depthColor.g + (surfaceColor.g - depthColor.g) * elevation;
            finalColor.b += depthColor.b + (surfaceColor.b - depthColor.b) * elevation;

            gl_FragColor = vec4(finalColor, 1.0);
        }
    `,
});

const shaderMesh = new THREE.Mesh(shaderGeometry, shaderMaterial);
shaderMesh.rotation.x = -Math.PI * 0.5;
scene.add(shaderMesh);
```

# Uniforms

For shaders, using uniform values have some performance costs. If what you are creating are not supposed to change, use define instead.

```glsl
#define uDisplacementStrength 1.5
```

Or do that in the property of the ShaderMaterial

```js
const shaderMaterial = new THREE.ShaderMaterial({

    // ...

    defines:
    {
        uDisplacementStrength: 1.5
    },

    // ...
}
```
