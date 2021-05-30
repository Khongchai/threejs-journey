<h1 style="text-align: center"><b>Read for a quick review</b></h1>

# What is a shader?

- A shader is a type of program used for shading in 3D scenes. It produces lit and shadowed areas in the rendering of 3D Models.
- There are several types of shading, Phong shading, Gouraud shading, etc.
- A shader is written in glsl, OpenGL Shading Language. Program written with glsl is sent directly to the GPU. https://en.wikipedia.org/wiki/OpenGL_Shading_Language
- glsl is an abstraction on top of the ARB assembly language.

## All data of the things that affect the visual representation of a scene gets sent to the shader:

- Coordinates of vertices, Mesh transformation, information about the camera, colors, textures, lights, fog, etc.

## There are two main types of shaders; we need both.

1. Vertex shader

   - As the name implies, it is used to position all the vertices of a geometry.
   - All the data that affect the visual representation, camera pos, rot, fov, mesh pos, rot, scale, etc., will be sent to the GPU.
   - The GPU then processes that info and decides how to project the vertices on a 2D space, which, in our case, is the HTML canvas.
   - Data that changes between each vertex = _attribute_. Data that don't = _uniform_.
   - Once the GPU knows which fragments of geometries are visible, fragment shader is then applied.

2. Fragment Shader

   - The role of the fragment shader is to apply color to each of the visible fragments.
   - Data can uniforms or special case of data that gets passed to it from the vertex shader, called _varying_ (basically attributes that get passed to the Fragment Shader from the Vertex Shader).
   - The more data about things that affect the lighting in a scene like a light position or intensity will affect the visual output.

# Why write our own shaders?

- Even for a material like MeshStandardMaterial, it still involves a lot of code. With our own shaders, we have complete control over the amount of code that gets run.
