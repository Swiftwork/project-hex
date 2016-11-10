precision highp float;

varying vec2 vUV;

uniform sampler2D textureSampler;

vec3 desaturate(vec3 color, float amount) {
  vec3 gray = vec3(dot(color, vec3(.299, .587, .114)));
  return mix(color, gray, amount);
}

vec3 darken(vec3 color, float amount) {
  vec3 black = vec3(0., 0., 0.);
  return mix(color, black, amount);
}

vec3 contrast(vec3 color, float amount) {
  return ((color.rgb - 0.5) * amount) + 0.5;
}

vec3 sepia(vec3 color, float amount) {
  float red = dot(color.rgb, vec3(.393, .769, .189));
  float green = dot(color.rgb, vec3(.349, .686, .168));
  float blue = dot(color.rgb, vec3(.272, .534, .131));
  return mix(color, vec3(red, green, blue), amount);
}

void main(void) {
  vec3 color = texture2D(textureSampler, vUV).rgb;
  color = sepia(color, 1.);
  //color = desaturate(color, 0.5);
  color = darken(color, 0.7);
  //color = contrast(color, 1.5);
  gl_FragColor = vec4(color, 1.);
}