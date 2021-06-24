uniform float uTime;

/*
    uv values go from 0.0 at the bottom left to 1.0 at the top right.
*/
varying vec2 vUv;

float random(vec2 st)
{
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

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

        Multiple edges pattern
        //More x, less y = vertical strips
        float barX = step(0.4, mod(vUv.x * 10.0, 1.0)) * step(0.8, mod(vUv.y * 10.0, 1.0));
        //Less x, more y = horizontal strips
        float barY = step(0.8, mod(vUv.x * 10.0, 1.0)) * step(0.4, mod(vUv.y * 10.0, 1.0));
        float strength = barX + barY;

        gl_FragColor = vec4(vec3(barY) , 1.0);

        Same as above, but we offset the verticle position of barX and the horizontal position of barY
        float barX = step(0.4, mod((vUv.x * 10.0), 1.0)) * step(0.8, mod((vUv.y * 10.0) + 0.2, 1.0));
        float barY = step(0.8, mod((vUv.x * 10.0) + 0.2, 1.0)) * step(0.4, mod(vUv.y * 10.0, 1.0));
        float strength = barX + barY;

        Black in the middle and gradient to white on left and right.
        float shiftedSlope = vUv.x - 0.5;
        float strength = abs(6.0 * pow(shiftedSlope, 2.0));

        gl_FragColor = vec4(vec3(strength) , 1.0);


        Cool x pattern with min and max
        float strength = min(abs(vUv.y - 0.5), abs(vUv.x - 0.5));
        gl_FragColor = vec4(vec3(strength) , 1.0);

        Similar to above, but we add a step so that the black gradient in the middle becomes a square.
        float strength = step(0.2, max(abs(vUv.y - 0.5), abs(vUv.x - 0.5)));
        gl_FragColor = vec4(vec3(strength) , 1.0);

        Similar to the one above, but this time we times the inverted function of itself whose border overlaps a bit.
        This overlapping value, once multiplied, will be the only visible points because for multiplication, when either
        the multiplicand or the multiplier is 0, the function just returns 0 -- invisible.
        float strength =  step(0.2, max(abs(vUv.x - 0.5), abs(vUv.y - 0.5)));
        strength *= 1.0 - step(0.25, max(abs(vUv.x - 0.5), abs(vUv.y - 0.5)));
        gl_FragColor = vec4(vec3(strength) , 1.0);

        Gets 50 shades of grey, vertical rows, with floor. Using floor returns a piecewise function.
        float shadesAmount = 50.0;
        float strength = floor(vUv.x * shadesAmount) / shadesAmount;
        gl_FragColor = vec4(vec3(strength), 1.0); 

        Get shades both horizontal and vertical by multiplying them together.
        As we have seen so far, to combine the results of two matrices, we should multiply.
        float shadesAmount = 10.0;
        float strength = floor(vUv.y * shadesAmount) / shadesAmount * floor(vUv.x * shadesAmount) / shadesAmount;
        gl_FragColor = vec4(vec3(strength), 1.0);  

        Get random value using dot product and fract
        float random(vec2 st)
        {
            return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
        }
        float strength = random(vUv);
        gl_FragColor = vec4(vec3(strength), 1.0); 
        Understanding the function
        TODO: come back to this
        Let's look at the dot product part first:


        Using the noise in the previous point, we can apply the floor function to have a more mosaic look.
        In this case, we have ten shades of colors from black to white.
        vec2 gridUv = vec2(floor(vUv.x * 10.0) / 10.0, floor(vUv.y * 10.0) / 10.0);
        float strength = random(gridUv);
        gl_FragColor = vec4(vec3(strength), 1.0);  

        This tilt effect is essentially gradually adding more and more values as x increases to the position of the y coordinate.
        vec2 gridUv = vec2(floor(vUv.x * 10.0) / 10.0, floor((vUv.y + vUv.x) * 10.0) / 10.0);
        float strength = random(gridUv);
        gl_FragColor = vec4(vec3(strength), 1.0);   



    */

    vec2 gridUv = vec2(floor(vUv.x * 10.0) / 10.0, floor((vUv.y + vUv.x) * 10.0) / 10.0);
    float strength = random(gridUv);
    gl_FragColor = vec4(vec3(strength), 1.0);      
    

}

