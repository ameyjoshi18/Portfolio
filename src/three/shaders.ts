export const nodeVertexShader = /* glsl */ `
  attribute vec3 aColor;
  attribute float aActivation;
  varying vec3 vColor;
  varying float vActivation;
  uniform float uBaseSize;
  void main() {
    vColor = aColor;
    vActivation = aActivation;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    float dist = max(0.5, -mvPosition.z);
    gl_PointSize = min(46.0, (uBaseSize * (1.0 + aActivation * 0.9)) / dist);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

export const nodeFragmentShader = /* glsl */ `
  varying vec3 vColor;
  varying float vActivation;
  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    if (d > 0.5) discard;
    float rim = smoothstep(0.5, 0.08, d);
    float core = smoothstep(0.22, 0.0, d);
    vec3 col = vColor * (0.55 + 0.45 * vActivation) + core * vColor * 0.7;
    float alpha = rim * (0.3 + 0.7 * vActivation);
    gl_FragColor = vec4(col, alpha);
  }
`;

export const edgeVertexShader = /* glsl */ `
  attribute vec3 aColor;
  attribute float aT;
  attribute float aActivation;
  varying vec3 vColor;
  varying float vT;
  varying float vActivation;
  void main() {
    vColor = aColor;
    vT = aT;
    vActivation = aActivation;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const edgeFragmentShader = /* glsl */ `
  uniform float uTime;
  varying vec3 vColor;
  varying float vT;
  varying float vActivation;
  void main() {
    float band = fract(vT - uTime * 0.12);
    float pulse = smoothstep(0.92, 1.0, band) + smoothstep(0.08, 0.0, band);
    vec3 col = vColor * (0.3 + 0.5 * vActivation) + pulse * vActivation * vec3(1.0, 0.85, 0.65) * 0.8;
    float alpha = (0.04 + 0.36 * vActivation) + pulse * vActivation * 0.25;
    gl_FragColor = vec4(col, alpha);
  }
`;
