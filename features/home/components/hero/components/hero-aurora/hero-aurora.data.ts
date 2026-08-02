/** Fullscreen-triangle vertex shader. */
export const VERT = `
attribute vec2 aPos;
varying vec2 vUv;
void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}`;

/**
 * Ember-plume fragment shader — domain-warped fractal noise gives the
 * plumes their organic drift; the field warps gently toward the cursor.
 */
export const FRAG = `
precision highp float;
varying vec2 vUv;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uMouse;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 345.45));
  p += dot(p, p + 34.345);
  return fract(p.x * p.y);
}
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p = m * p;
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = vUv;
  float aspect = uRes.x / uRes.y;
  vec2 p = vec2(uv.x * aspect, uv.y) * 2.1;

  float t = uTime * 0.06;
  vec2 drift = vec2(0.0, t * 1.5);          // heat rising
  vec2 mo = uMouse * vec2(0.32, 0.22);

  // Two-stage domain warp for organic, non-repeating plumes.
  vec2 q = vec2(
    fbm(p + drift + mo),
    fbm(p + vec2(5.2, 1.3) + drift * 1.2)
  );
  vec2 r = vec2(
    fbm(p + 1.8 * q + vec2(1.7, 9.2) + 0.15 * t),
    fbm(p + 1.8 * q + vec2(8.3, 2.8) - 0.12 * t)
  );
  float n = fbm(p + 1.9 * r);

  // Shape the noise into soft plumes.
  float plume = smoothstep(0.24, 0.92, n);

  // Slightly stronger low, gentle fade toward the very top — heat that rises.
  float vfall = mix(0.55, 1.0, smoothstep(1.0, 0.1, uv.y));
  float intensity = plume * vfall * 0.9;

  // Warm ember → amber → hot core ramp.
  vec3 ember = vec3(0.40, 0.11, 0.02);
  vec3 amber = vec3(0.97, 0.70, 0.40);
  vec3 hot   = vec3(1.00, 0.86, 0.62);
  vec3 col = mix(ember, amber, smoothstep(0.15, 0.7, n));
  col = mix(col, hot, smoothstep(0.72, 1.0, n) * 0.6);

  // Opaque black base; the element screen-blends, so black adds nothing and
  // only the bright plumes glow through around the subject.
  gl_FragColor = vec4(col * intensity, 1.0);
}`;
