varying vec3 vColor;
uniform float uTime;

 void main()
{
    /*
        Light point 
    */
    //gl_PointCoord is the coordinate of each fragment within each point of the particles.
    float strength = distance(gl_PointCoord, vec2(0.5));

    strength = 1.0 - strength;
    //Get a diffuse center, instead of step, you use multiplication to incrase the difference between
    //higher and lower values.
    //And of course, more difference requires higher number
    //This version, however, is linear.
    // strength = strength * 10.0;
    /*
        Use power for a non-linear version 
    */
    strength = pow(strength, 10.0);

    //Final color
    //Use the strength to control color between black and vColor
    vec3 color = mix(vec3(0.0), vColor, strength);
    gl_FragColor = vec4(vec3(color), 1.0);
}