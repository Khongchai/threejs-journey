//retrieve uv coordinate 
//No need to actually do this because unlike RawShaderMaterial, the code is prepended with this already
// attribute vec2 uv;
varying vec2 vUv;

void main()
{
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}