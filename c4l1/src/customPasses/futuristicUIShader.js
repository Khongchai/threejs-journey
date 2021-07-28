//We can also use a texture as a shader.
export const FuturisticUIShader = {
    uniforms: {
        tDiffuse: { value: null },
        uTime: { value: null },
        uNormalMap: { value: null },
    },
    vertexShader: `
        varying vec2 vUv;

        void main()
        {
            gl_Position = projectionMatrix  * (modelViewMatrix * vec4(position, 1.0) );

            vUv = uv;
        }
    `,
    fragmentShader: `
        uniform sampler2D tDiffuse;
        uniform float uTime;
        uniform sampler2D uNormalMap;

        varying vec2 vUv;

        void main()
        {
            //get the color of the normal texture.
            vec3 normalColor = texture2D(uNormalMap, vUv).xyz * 2.0 - 1.0;
            //apply the texture to the original uv.
            vec2 newUv = vUv + normalColor.xy * 0.1;
            vec4 color = texture2D(tDiffuse, newUv);

            //Say where the light is coming from and normalize to keep value within 1 (like, not too strong)
            vec3 lightDirection = normalize(vec3(-1.0, 1.0, 0.0));

            //Find the similarities in the values (dot product) between normalColor nad lightDireciton
            float lightness = clamp(dot(normalColor, lightDirection), 0.0, 1.0);
            color.rgb += lightness * 2.0;

            gl_FragColor = color;
            
        }
    `,
};
