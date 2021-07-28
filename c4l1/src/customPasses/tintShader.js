export const TintShader = {
    uniforms: {
        //Must be null, EffectComposer will know and update it and the value will be
        //automatically retrieved in the fragmentShader
        tDiffuse: { value: null },
        /**
         * As you can see, we set the value to "null". You shouldn't set the values
         * directly in the shader object. You must set them on the material after
         * the pass is created. This is because the shader is intended to be used multiple times.
         *
         * It is also like a template for the pass.
         */
        uTint: { value: null },
    },
    vertexShader: `
        //get uv coordiantes from the previous shader.
        varying vec2 vUv;        

        void main()
        {
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            
            //Don't forget to pass on the varying to fragmentShader
            vUv = uv;
        }   
    `,
    fragmentShader: `
        uniform sampler2D tDiffuse;
        uniform vec3 uTint;
        varying vec2 vUv;

        void main()
        {
            //tDiffuse is the shader from the previous pass.
            

            vec4 color = texture2D(tDiffuse, vUv);
            color.r += 0.1;
            color.rgb += uTint;
            gl_FragColor = color;
        }
    `,
};
