uniform float uTime;
uniform vec2 uMouse;

/*
    uv values go from 0.0 at the bottom left to 1.0 at the top right.
*/
varying vec2 vUv;
const float PI = 3.1415926535897932384626433832795;

float random(vec2 st)
{
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

vec2 rotate(vec2 uv, float rotation, vec2 mid)
{
    //where mid is only for calibration.
    //Explanation for the formula in ./rotationFormula.md

    /*
        Formula:
            x = xcos(θ) - ysin(θ)
            y = xsin(θ) + ycos(θ)
    */
    return vec2(
      (uv.x - mid.x) * cos(rotation) - (uv.y - mid.y) * sin(rotation) + mid.x,
       (uv.x - mid.x) * sin(rotation) + (uv.y - mid.y) * cos(rotation)  + mid.y
    );
}

//  Classic Perlin 2D Noise 
//  by Stefan Gustavson
//
vec2 fade(vec2 t)
{
    return t*t*t*(t*(t*6.0-15.0)+10.0);
}

vec4 permute(vec4 x)
{
    return mod(((x*34.0)+1.0)*x, 289.0);
}

float cnoise(vec2 P, float x, float y)
{
    vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0 , 1.0);
    vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
    Pi = mod(Pi, 289.0); // To avoid truncation effects in permutation
    vec4 ix = Pi.xzxz;
    vec4 iy = Pi.yyww;
    vec4 fx = Pf.xzxz;
    vec4 fy = Pf.yyww;
    vec4 i = permute(permute(ix) + iy);
    vec4 gx = 2.0 * fract(i * 0.0243902439) - 1.0; // 1/41 = 0.024...
    vec4 gy = abs(gx) - 0.5;
    vec4 tx = floor(gx + 0.5);
    gx = gx - tx;
    vec2 g00 = vec2(gx.x,gy.x);
    vec2 g10 = vec2(gx.y,gy.y);
    vec2 g01 = vec2(gx.z,gy.z);
    vec2 g11 = vec2(gx.w,gy.w);
    vec4 norm = (0.39284291400159 * (1.0/pow(y, 2.0) + 1.0)) - (0.373472095314 * x) * vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11));
    g00 *= norm.x;
    g01 *= norm.y;
    g10 *= norm.z;
    g11 *= norm.w;
    float n00 = dot(g00, vec2(fx.x, fy.x));
    float n10 = dot(g10, vec2(fx.y, fy.y));
    float n01 = dot(g01, vec2(fx.z, fy.z));
    float n11 = dot(g11, vec2(fx.w, fy.w));
    vec2 fade_xy = fade(Pf.xy);
    vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
    float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
    return 2.3 * n_xy;
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

        Color based on the lenght of each vector.
        Length of each vector is defined by the Euclidean norm, i.e. the square root of the sum of the squared coordinate x and y.
        float strength = length(vUv);
        gl_FragColor = vec4(vec3(strength), 1.0);   

        Now, we will create a dark circle right at the center of the plane.
        How? The coordinate goes from 0 to 1 for both x and y, therefore, the very center
        sits at (0.5, 0.5).
        Knowing this, we can use the distance between the center and each vertex as the color.
        float strength = distance(vUv, vec2(0.5));


        limit as x approaches 0 of 0.015 / x is infinity. So we creating a really bright dot in the middle, essentially.
        float strength =  0.015 / distance(vUv, vec2(0.5));
        gl_FragColor = vec4(vec3(strength), 1.0);      

        Same as prev but we are squeezing only one axis, the y axis. If we squeeze both, we get a smaller dot, 
        but if we squeeze only one, we get an elongated line.
        The addition and subtraction is just for recentering.
        float strength =  0.15 / (distance((vec2(vUv.x, (vUv.y-0.5) * 5.0 + 0.5)), vec2(0.5)));
        gl_FragColor = vec4(vec3(strength), 1.0);      

        Like above, but we combine with multiplication the y and x axes to make a star shape.
        float strength = 0.15 / (distance(vec2(vUv.x, (vUv.y - 0.5) * 5.0 + 0.5), vec2(0.5)));
        strength *= 0.15 / (distance(vec2(vUv.y, (vUv.x - 0.5) * 5.0 + 0.5), vec2(0.5)));
        gl_FragColor = vec4(vec3(strength), 1.0); 

        rotation
        vec2 rotatedUv = rotate(vUv, PI/2.0, vec2(0.5));
        float strength = 0.15 / (distance(vec2(rotatedUv.x, (rotatedUv.y - 0.5) * 5.0 + 0.5), vec2(0.5)));
        gl_FragColor = vec4(vec3(strength), 1.0);      

        This one would get us a black circle with no gradient. 
        float reduceRadius = - 0.25;
        float strength = step(0.5, distance(vUv, vec2(0.5)) - reduceRadius);
        gl_FragColor = vec4(vec3(strength), 1.0);      

        This one, instead of using step to get a circle, we do abs value to keep the gradient value but with a gradient
        white spot in the middle.
        float strength = abs(distance(vUv, vec2(0.5)) + reduceRadius);

        This one gets a really small ring in the middle.
        Note that the absolute value works because there is a reduceRadius variable that's 
        pushing some values down below 0.
        float reduceRadius = 0.25;
        float strength = step(0.02, abs(distance(vUv, vec2(0.5)) - reduceRadius));
        gl_FragColor = vec4(vec3(strength), 1.0);  

        Then, using the above's equation, we can flip black to white and vice versa with 
        float strength = 1.0 - step(0.02, abs(distance(vUv, vec2(0.5)) - reduceRadius)); 
        Where the output of the righthand expression is either 1 or 0.

        Based on the prev one, but wavy!
        vec2 wavedUv = vec2(
        vUv.x, 
        vUv.y + sin(vUv.x * 30.0) * 0.1
        );
        float reduceRadius = 0.25;
        float strength = 1.0 - step(0.02, abs(distance(wavedUv, vec2(0.5)) - reduceRadius));
        gl_FragColor = vec4(vec3(strength), 1.0);      

        Wavy both x and y, but also interactive!
        vec2 wavedUv = vec2(
            vUv.x + sin(vUv.y * uMouse.x) * 0.1, 
            vUv.y + sin(vUv.x * uMouse.y) * 0.1
        );
        float reduceRadius = 0.25;
        float strength = 1.0 - step(0.02, abs(distance(wavedUv, vec2(0.5)) - reduceRadius));
        gl_FragColor = vec4(vec3(strength), 1.0); 
        If you increase the strength of uMouse, it will become super crazy!     

        We can also use angles as well.
        The angle is relative to the bottom of the plane.
        Using arctan returns 
        float angle = atan(vUv.x, vUv.y);
        gl_FragColor = angle;

        Get gradient around 1 center point.
        First line centers the 0,0 position, vertices now go from -0.5 to 0.5 for both x and y axes.
        The arctan returns value in angle from -pi to +pi.
        this means that if we divide it by 2pi, we'll get a value between 0.5 and -0.5.
        We now have a linearly increasing x between -pi and +pi. 
        Because to gl_Fragcolor, values below 0 is just black, to make use of the data below 0, 
        we'll just incrase all values by 0.5, making the output now sanwiched between 0 and 1.
        float angle = atan(vUv.x - 0.5, vUv.y - 0.5);
        angle /= PI*2.0;
        float strength = angle + 0.5;
        gl_FragColor = vec4(vec3(strength), 1.0); 
        This means that if you were to do anything that reflects the exact shape on a cartesian plane, 
        you would have to offset the vertices of the center point by - 0.5 each. 
        https://www.desmos.com/calculator/59xn2jyqfw

        This angle is a proper building block for us to build a circular shape.
        float angle = atan(vUv.x - 0.5, vUv.y - 0.5) / (PI * 2.0) + 0.5;

        We can do a bunch of techniques we did in the beginning with this.
        One would be the modulo technique:
        float strength = mod(angle * 20.0, 1.0);
        or sin
        float strength = sin(angle * 100.0);

        Moving droplet 
        Combining this with another element whose movement is the integral of whatever functions we have here might produce a nice effect.
        vec2 wavedUv = vec2(
            vUv.x + sin(vUv.y * uMouse.x * 0.59) * 0.1,
            vUv.y + cos(vUv.x * uMouse.y * 0.4) * 0.1
        );
         float reduceRadius = 0.25;
        float strength = 1.0 - step(0.02, abs(distance(wavedUv, vec2(0.5)) - reduceRadius));

        vec3 blackColor = vec3(0.0);
        float r = mix(0.8, 0.976, vUv.x );
        float g = mix(0.49, 0.624, vUv.y);
        float b = mix(0.72, 0.3, vUv.y);

        vec3 mixedColor = mix(blackColor, vec3(r, g, b), strength);

        gl_FragColor = vec4(vec3(mixedColor), 1.0);

        This one uses the japanese flag thingy to control the radius.
        the value 0.25 of radius controls the overall differnce in values of the radius plane from 0.
        float angle = atan(vUv.x - 0.5, vUv.y - 0.5) / (PI * 2.0) + 0.5;
        float radius = 0.25 + sin(angle * 100.0) * 0.02;
        float strength = 1.0 - step(0.01, abs(distance(vUv, vec2(0.5)) - radius));
        gl_FragColor = vec4(vec3(strength), 1.0);

        interesting pattern with perlin noise:
         float strength = 1.0 - abs( cnoise(vUv * 10.0));
        gl_FragColor = vec4(vec3(strength), 1.0);

        Perlin noise with patterns created by a sine fucntion
        float strength = sin(cnoise(vUv * 10.0) * 20.0);
        gl_FragColor = vec4(vec3(strength), 1.0);

        From the above example, we  can use step to remove the feathering
        float strength = step(0.9, sin(cnoise(vUv * 10.0) * 20.0));

        Random stuff with cnoise
        // float strength = sin(cnoise(vUv * 10.0) * 20.0);
        vec3 blackColor = vec3(0.0);
        float r = mix(0.8, 0.976, vUv.x );
        float g = mix(0.49, 0.624, vUv.y);
        float b = mix(0.72, 0.3, vUv.y);

        float strength = step(0.9, sin(cnoise(vUv * (10.0), uMouse.x, uMouse.y) * 20.0 + (sin(uTime))));

        vec3 mixedColor = mix(blackColor, vec3(r, g, b), strength);

        gl_FragColor = vec4(vec3(mixedColor), 1.0);

        Nice flame
        float fireShape = mix(0.1, 2.0, vUv.y);
        float fireStrength = mix(0.01, 0.1, vUv.y);
        float sineFlameVariation = sin(uTime * 0.8) * 5.0;
        float cosFlameVariation = cos(uTime * 0.78) * 5.0;
        float windX = uMouse.x * 0.6;
        float windY = uMouse.y * 0.8;
        vec2 wavedUv = vec2(
            vUv.x + sin(vUv.y * (windX - sineFlameVariation)* fireShape ) * fireStrength,
            vUv.y + cos(vUv.x * (windY - cosFlameVariation) * fireShape ) * fireStrength
        );
        
         float reduceRadius = 0.25;
        float strength = 1.0 - step(0.02, abs(distance(wavedUv, vec2(0.5)) - reduceRadius));

        vec3 blackColor = vec3(0.0);
        float r = mix(0.8, 0.976, vUv.x );
        float g = mix(0.49, 0.624, vUv.y);
        float b = mix(0.72, 0.3, vUv.y);

        vec3 mixedColor = mix(blackColor, vec3(r, g, b), strength);

        gl_FragColor = vec4(vec3(mixedColor), 1.0);

        */

        float fireShape = mix(0.1, 2.0, vUv.y);
        float fireStrength = mix(0.01, 0.1, vUv.y);
        float sineFlameVariation = sin(uTime * 0.8) * 5.0;
        float cosFlameVariation = cos(uTime * 0.78) * 5.0;
        float windX = uMouse.x * 0.6;
        float windY = uMouse.y * 0.8;
        vec2 wavedUv = vec2(
            vUv.x + sin(vUv.y * (windX - sineFlameVariation)* fireShape ) * fireStrength,
            vUv.y + cos(vUv.x * (windY - cosFlameVariation) * fireShape ) * fireStrength
        );
        
         float reduceRadius = 0.25;
        float strength = 1.0 - step(0.02, abs(distance(wavedUv, vec2(0.5)) - reduceRadius));

        vec3 blackColor = vec3(0.0);
        float r = mix(0.8, 0.976, vUv.x );
        float g = mix(0.49, 0.624, vUv.y);
        float b = mix(0.72, 0.3, vUv.y);

        vec3 mixedColor = mix(blackColor, vec3(r, g, b), strength);

        gl_FragColor = vec4(vec3(mixedColor), 1.0);
    
}

