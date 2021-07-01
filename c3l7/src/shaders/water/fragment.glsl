uniform vec3 uDepthColor;
uniform vec3 uSurfaceColor;
uniform float uColorIntensity;
uniform float uColorContrast;

varying float vElevation;

void main()
{
    /*
        Multiplication creates more contrast between low and high values,
        whereas addition just brings the overall intensity up.

        To bring out the color difference between the uDepthColor and uSurfaceColor, we need to
    */
    float mixStrength = (vElevation + uColorIntensity) * uColorContrast;
    vec3 color = mix(uDepthColor, uSurfaceColor, mixStrength);
    gl_FragColor = vec4(color, 1.0);
}