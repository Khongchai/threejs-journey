uniform float uSize;
uniform float uTime;
attribute vec3 aRandomness;

//Recall that we do attribute instead of uniform because this value 
//is not the same for all vertices.
attribute float aScale;

attribute vec3 aColor;
varying vec3 vColor;

void main()
{
    /**
        Position
    */
    /*
        Algorithm for the rotation:
         - We calculate the particle angle —seen from above the galaxy— and its distance to the center.
         - We increase that angle using the distance from the center and the uTime. The furthest from the center the slower.
         - We update the position according to that new angle.  
    */
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    //Use inverse tan to get an angle
    //This is saying, tan^-1(x/z), get me the angle theta, whose trigonometric arctangent equals x/z;
    //This modelPosition is relative to the center of the scene
    float angle = atan(modelPosition.x, modelPosition.z);
    //length() gets you position from 0.0 coord, unlike distance(), which gets you length from anywhere
    float distanceToCenter = length(modelPosition.xz);
    float angleOffset = (1.0 / distanceToCenter) * uTime * 0.5;
    angle += angleOffset;
    modelPosition.x = cos(angle) * distanceToCenter;
    modelPosition.z = sin(angle) * distanceToCenter;

    modelPosition.xyz += aRandomness;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;

    /**
        * Size
        */
    gl_PointSize = uSize * aScale;
    gl_PointSize *= (1.0 / - viewPosition.z);

    vColor = aColor;
}