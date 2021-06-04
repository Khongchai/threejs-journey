//Deals with the position of matrices; manipulate mesh vertex positions here: make flags, waves, weird shapes, etc.



/*
    Clip space
*/
//The projection matrix transform coordinates into the final clip space coordinates.
//Anything that falls outside of the specified coordinates gets clipped out.
//The portion that remains inside the clip space is called a frustum
uniform mat4 projectionMatrix;


/*
    View space (camera)
*/
//Retrieve all transformations relative to the camera; camera t oleft, verts go right, camera dolly in, verts bigger.
uniform mat4 viewMatrix;


/*
    world space
*/
//Retreive all transformations relative to the mesh, like scale, rotate, or move, and position it into a world space.
uniform mat4 modelMatrix;

//More >> important read https://learnopengl.com/Getting-started/Coordinate-Systems

/*
    Local space
*/
//retrieve the vertex position
attribute vec3 position;
uniform float uTime;

void main()
{
    //For perspective division
    float w = 1.0;
    //The gl_Position variable is already declared. You only have to assign a value to it.
    /*
        Question: Why do we need a vec4 for a 2d representation?
        Ans: The first three values, xyz, is a 3d space representation, as for the fourth,
             the gl_Position is a homogeneous coordinates. 

        Homogeneous coordinates or projective coordinates are a system used in projective geometry, 
        in other words, we use it to aid the perspective projection. This means that for an orthographic view,
        the w variable will not be touched (it will stay 1.0).

        https://gamedev.stackexchange.com/questions/153078/what-can-i-do-with-the-4th-component-of-gl-position
    */
    //Moving gl position will move the entire projected scene in a 2d space. 
    //Imagine moving a piece of paper with drawings in it, moving gl_Position 

    //You can control the position of the model with this
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    float amplitudeReduction = 0.1;
    float frequencyCompression = 10.0;
    modelPosition.z = sin(modelPosition.x * frequencyCompression) * amplitudeReduction;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition; 


}