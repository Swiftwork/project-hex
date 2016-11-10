precision highp float;

// Cartoon color
vec3 _Color = vec3(0.95, 0.85, 0.75);

// Lights
vec3 _LightColor = vec3(1, 1, 1);
vec3 _UnlitColor = vec3(0, 0, 0);
float _DiffuseThreshold =  0.1;
vec4 _SpecColor = vec4(1, 1, 1, 0.7);
float _Shininess = 10.0;

// Outline
vec3 _OutlineColor = vec3(0, 0, 0);
float _LitOutlineThickness = 0.1;
float _UnlitOutlineThickness = 0.4;

// Varying
varying vec3 vPositionW;
varying vec3 vNormalW;
varying vec2 vUV;

// Refs
uniform sampler2D textureSampler;
uniform vec3 cameraPosition;

void main() {
  vec3 normalDirection = normalize(vNormalW);
  vec3 viewDirection = normalize(cameraPosition - vec3(vPositionW));
  
  // Light position (static or from scene)
  vec4 vLightPosition = vec4(0, 20, 10, 0);

  vec3 lightDirection;
  float attenuation;

  if (0.0 == vLightPosition.w) { // directional light?
     attenuation = 1.0; // no attenuation
     lightDirection = normalize(vec3(vLightPosition));
     
  } else { // point or spot light
     vec3 vertexToLightSource = vec3(vLightPosition.xyz - vPositionW);
     float distance = length(vertexToLightSource);
     attenuation = 1.0 / distance; // linear attenuation 
     lightDirection = normalize(vertexToLightSource);
  }
  
  // Texture or color
  vec3 fragmentColor = texture2D(textureSampler, vUV).rgb;
  fragmentColor = mix(fragmentColor, _Color, 1.0);
  
  // low priority: diffuse illumination
  if (attenuation 
     * max(0.0, dot(normalDirection, lightDirection)) 
     >= _DiffuseThreshold) {
    fragmentColor = fragmentColor * _LightColor;
    
  } else {
    fragmentColor = mix(fragmentColor, _UnlitColor, 0.5);
  }
  
  
  // higher priority: outline
  if (dot(viewDirection, normalDirection) 
     < mix(_UnlitOutlineThickness, _LitOutlineThickness, 
     max(0.0, dot(normalDirection, lightDirection)))) {
       
     fragmentColor = mix(_Color,  _OutlineColor, 0.8);
  }
  
  // highest priority: highlights
  if (dot(normalDirection, lightDirection) > 0.0 
     // light source on the right side?
     && attenuation *  pow(max(0.0, dot(
     reflect(-lightDirection, normalDirection), 
     viewDirection)), _Shininess) > 0.5) { // more than half highlight intensity?
     
     fragmentColor = _SpecColor.a * vec3(_LightColor) * vec3(_SpecColor) + (1.0 - _SpecColor.a) * fragmentColor;
  }

  gl_FragColor = vec4(fragmentColor, 1.0);
 }