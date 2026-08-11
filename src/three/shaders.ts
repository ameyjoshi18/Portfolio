// Flat, discretely-shaded blocks — three tone bands from a fixed light direction,
// never a smooth gradient. No transparency, no additive blending: flat means flat.
export const blockVertexShader = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vColor;
  void main() {
    #ifdef USE_INSTANCING_COLOR
      vColor = instanceColor;
    #else
      vColor = vec3(1.0);
    #endif
    vec3 transformedNormal = normalize(mat3(instanceMatrix) * normal);
    vNormal = normalize(mat3(modelViewMatrix) * transformedNormal);
    vec4 mvPosition = modelViewMatrix * instanceMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

export const blockFragmentShader = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vColor;
  void main() {
    vec3 lightDir = normalize(vec3(0.5, 0.85, 0.35));
    float d = dot(normalize(vNormal), lightDir);
    float band = d > 0.5 ? 1.0 : (d > -0.1 ? 0.78 : 0.58);
    gl_FragColor = vec4(vColor * band, 1.0);
  }
`;
