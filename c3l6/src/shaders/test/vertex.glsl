//retrieve uv coordinate 
//No need to actually do this because unlike RawShaderMaterial, the code is prepended with this already
// attribute vec2 uv;
varying vec2 vUv;
const float PI = 3.1415926535897932384626433832795;


void main()
{

    
    vUv = uv;
    vec4 modelPosition = modelViewMatrix * vec4(position, 1.0);

    gl_Position = projectionMatrix * modelPosition;
}