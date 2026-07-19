export const motionTokens = {
  drift: {
    minDistance: 8,
    maxDistance: 32,
    maxPlanes: 3,
  },
  align: {
    minDuration: 0.48,
    maxDuration: 0.7,
  },
  flow: {
    maxConcurrent: 1,
  },
} as const;
