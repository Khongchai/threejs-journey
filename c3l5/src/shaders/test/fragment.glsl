//Determines the precision of float values
precision mediump float;

//Varying from vertex shader
varying float vRandom;
//Contrary to varying, uniforms can be obtained directly from threejs
uniform vec3 uColor;

uniform sampler2D uTexture;
varying vec2 vUv;
varying float vElevation;

void main()
{
    /*
    * Just like the gl_Position value, but for colors.
    * The params are rgba
    * Each of the values go from 0.0 to 1.0, it is possible to go beyond without errors, but nothing will happen.
    */
    //To use the alpha value, set the transparent property to true in THREE.RawShaderMaterial
    // gl_FragColor = vec4(uColor, 1.0);

    //Using colors from a texture
    vec4 textureColor = texture2D(uTexture, vUv);
    textureColor.rgb *= vElevation * 2.0 + 0.5;
    gl_FragColor = textureColor;

    //We can use the varying value like so
    // gl_FragColor = vec4(.5, vRandom, 1.0, 1.0);

}