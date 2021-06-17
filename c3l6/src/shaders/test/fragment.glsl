uniform float uTime;

/*
    uv values go from 0.0 at the bottom left to 1.0 at the top right.
*/
varying vec2 vUv;

void main()
{

    /*
    
        If confused about any of the math, just convert them too 
        normal notation and inspect the function in Desmos.

        This code produces a nice gradient color from blue to pink: https://threejs-journey.xyz/assets/lessons/25/base-01.png
        Why? Recall that varyings are values that change with each vertex. UV is a varying, so with each new vertex position, the 
        color gets changed as well.
        // gl_FragColor = vec4(vUv, 1.0, 1.0);

        Each combination gives different results, it's now a matter of experiment and finding the ones that you'll use the most.

        moving corrugated pattern:
        float strength = sin(vUv.y * 20.0 + uTime) * 0.2 + 0.5;
        gl_FragColor = vec4(vec3(strength), 1.0);

        crosswalk pattern with a bit of gradient: 
        float strength = mod(vUv.y * 10.0, 1.0);
        gl_FragColor = vec4(vec3(strength), 1.0);

        crosswalk pattern with no gradient:
        float strength = mod(vUv.y * 10.0, 1.0);
        strength = step(0.5, strength);
        gl_FragColor = vec4(vec3(strength), 1.0);

        cross pattern in both x and y direction
        float strength = step(0.8, mod(vUv.y * 10.0, 1.0));
        strength += step(0.8, mod(vUv.x * 10.0, 1.0));
        gl_FragColor = vec4(vec3(strength), 1.0);

        Cross pattern but only intersections are visible.
        (Because the multiplication sign, only places where the result of both x and y equals 1 will be visible)
        float strength = step(0.8, mod(vUv.y * 10.0, 1.0));
        strength *= step(0.8, mod(vUv.x * 10.0, 1.0));

        gl_FragColor = vec4(vec3(strength), 1.0);

        Same as above but it moves too!
        If you change the geometry to something else other than a plane, you'll get 
        really cool-looking effects.
        float slowDownFactor = 15.0;
        float strength = step(0.8, mod((vUv.y + sin(uTime) / slowDownFactor) * 10.0, 1.0));
        strength *= step(0.8, mod((vUv.x + uTime / slowDownFactor) * 10.0, 1.0));

        gl_FragColor = vec4(vec3(strength) , 1.0);

    */

    float slowDownFactor = 15.0;
    float strength = step(0.8, mod((vUv.y + sin(uTime) / slowDownFactor) * 10.0, 1.0));
    strength *= step(0.8, mod((vUv.x + uTime / slowDownFactor) * 10.0, 1.0));

    gl_FragColor = vec4(vec3(strength) , 1.0);
}