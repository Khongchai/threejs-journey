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
   - {{to understand}} => {attribute}

2. Fragment Shader

   -
