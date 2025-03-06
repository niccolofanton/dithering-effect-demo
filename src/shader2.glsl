    uniform float time;
    uniform vec2 resolution;
    uniform float gridSize;
    uniform float luminanceMethod;
    uniform float contrast;
    uniform float brightness;
    uniform float invertColor;
    
    // New dithering toggle
    uniform float ditheringEnabled;
    
    // Toon shader uniforms
    uniform int toonShaderEnabled;
    uniform vec3 toonColorA;
    uniform vec3 toonColorB;
    uniform vec3 toonColorC;

    bool getValue(float brightness, vec2 pos) {
      if (brightness > 16.0 / 17.0) return false;
      if (brightness < 1.0 / 17.0) return true;
      
      vec2 pixel = floor(mod(pos.xy / gridSize, 4.0));
      int x = int(pixel.x);
      int y = int(pixel.y);
      
      if (x == 0 && y == 0) return brightness < 16.0 / 17.0;
      if (x == 2 && y == 2) return brightness < 15.0 / 17.0;
      if (x == 2 && y == 0) return brightness < 14.0 / 17.0;
      if (x == 0 && y == 2) return brightness < 13.0 / 17.0;
      if (x == 1 && y == 1) return brightness < 12.0 / 17.0;
      if (x == 3 && y == 3) return brightness < 11.0 / 17.0;
      if (x == 3 && y == 1) return brightness < 10.0 / 17.0;
      if (x == 1 && y == 3) return brightness < 9.0 / 17.0;
      if (x == 1 && y == 0) return brightness < 8.0 / 17.0;
      if (x == 3 && y == 2) return brightness < 7.0 / 17.0;
      if (x == 3 && y == 0) return brightness < 6.0 / 17.0;
      if (x == 0 && y == 1) return brightness < 5.0 / 17.0;
      if (x == 1 && y == 2) return brightness < 4.0 / 17.0;
      if (x == 2 && y == 3) return brightness < 3.0 / 17.0;
      if (x == 2 && y == 1) return brightness < 2.0 / 17.0;
      if (x == 0 && y == 3) return brightness < 1.0 / 17.0;
      
      return false;
    }

    vec3 applyToonShader(vec3 color, float luminance) {
      if (luminance > 0.66) return toonColorA;
      if (luminance > 0.33) return toonColorB;
      return toonColorC;
    }

    void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
      vec2 fragCoord = uv * resolution;
      
      float luminance = dot(inputColor.rgb, vec3(0.2126, 0.7152, 0.0722));
      
      luminance = (luminance - 0.5) * contrast + 0.5 + brightness;
      luminance = clamp(luminance, 0.0, 1.0);
      
      vec3 baseColor = inputColor.rgb;
     
      if (toonShaderEnabled > 0) {
        baseColor = applyToonShader(baseColor, luminance);
      }
      
      if (ditheringEnabled > 0.0) {
        // if (toonShaderEnabled > 0) {
        //   if (luminance > 0.66) {
        //     baseColor = toonColorA;
        //   } else if (luminance > 0.33) {
        //     baseColor = toonColorB;
        //   } else {
        //     baseColor = toonColorC;
        //   }
        // }
        
        // float ditherLuminance = dot(baseColor, vec3(.7, 0.6, 0.0722));

        // this regulates how mouch is max/min light + multiplication value for each color channel
        float ditherLuminance = clamp(dot(baseColor, vec3(0.1, 0.6, 0.0722)), 0.1 , .3);

        bool dithered = getValue(ditherLuminance, fragCoord);
        baseColor = mix(baseColor, vec3(.0), float(dithered));
      }
      
      if (invertColor > 0.0) {
        baseColor = 1.0 - baseColor;
      }

      outputColor = vec4(baseColor, inputColor.a);
    }