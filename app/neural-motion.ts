export type Position3D = readonly [number, number, number];
const TAU = Math.PI * 2;
export const CIRCUIT_SECONDS = 30;
export const REVOLUTION_SECONDS = 60;

// Control points follow both lobes of the supplied NeuraOps artwork. The two
// open ribbon tips are joined by a recessed synapse, behind the front crossing.
const anchors: Position3D[] = [
  [445, 235, .025], [650, 300, .04], [810, 435, .055], [946, 510, .035],
  [1050, 552, -.065], [1170, 510, -.025], [1250, 380, .015], [1220, 255, .035],
  [1130, 207, .025], [1000, 254, -.015], [855, 345, -.075], [690, 460, -.07],
  [500, 548, -.005], [365, 525, .015], [310, 415, .025], [345, 300, .03],
].map(([x, y, z]) => [(x - 773.5) / 1041, (y - 364.5) / 1041, z]);

function curvePoint(progress: number): Position3D {
  const position = ((progress % 1 + 1) % 1) * anchors.length;
  const index = Math.floor(position), t = position - index;
  const p0 = anchors[(index + anchors.length - 1) % anchors.length];
  const p1 = anchors[index], p2 = anchors[(index + 1) % anchors.length], p3 = anchors[(index + 2) % anchors.length];
  const component = (axis: number) => .5 * ((2 * p1[axis]) + (-p0[axis] + p2[axis]) * t +
    (2 * p0[axis] - 5 * p1[axis] + 4 * p2[axis] - p3[axis]) * t * t +
    (-p0[axis] + 3 * p1[axis] - 3 * p2[axis] + p3[axis]) * t * t * t);
  return [component(0), component(1), component(2)];
}

// Arc-length sampling keeps neurons moving smoothly through every curve,
// rather than slowing at control points or bouncing along short local paths.
const samples = Array.from({ length: 1025 }, (_, i) => curvePoint(i / 1024));
const lengths = [0];
for (let i = 1; i < samples.length; i++) {
  lengths.push(lengths[i - 1] + Math.hypot(...samples[i].map((n, axis) => n - samples[i - 1][axis])));
}

export function circuitPoint(progress: number, lane = 0): Position3D {
  const distance = ((progress % 1 + 1) % 1) * lengths[lengths.length - 1];
  let low = 0, high = lengths.length - 1;
  while (low + 1 < high) {
    const middle = (low + high) >> 1;
    if (lengths[middle] <= distance) low = middle; else high = middle;
  }
  const a = samples[low], b = samples[high];
  const mix = (distance - lengths[low]) / (lengths[high] - lengths[low]);
  const dx = b[0] - a[0], dy = b[1] - a[1], planarLength = Math.hypot(dx, dy) || 1;
  return [a[0] + dx * mix - dy / planarLength * lane,
    a[1] + dy * mix + dx / planarLength * lane,
    a[2] + (b[2] - a[2]) * mix];
}

export function revolutionAngle(seconds: number): number {
  const phase = seconds / REVOLUTION_SECONDS * TAU;
  // Linger near the full silhouette, then sweep more quickly through edge-on.
  return phase - .32 * Math.sin(phase * 2);
}

export function projectNeuron([x, y, z]: Position3D, yaw: number, tilt: number, roll = 0) {
  const rx = x * Math.cos(yaw) + z * Math.sin(yaw);
  const rz = z * Math.cos(yaw) - x * Math.sin(yaw);
  const ry = y * Math.cos(tilt) - rz * Math.sin(tilt);
  const depth = y * Math.sin(tilt) + rz * Math.cos(tilt);
  const perspective = 1 / (1 - depth * .65);
  return { x: (rx * Math.cos(roll) - ry * Math.sin(roll)) * perspective,
    y: (rx * Math.sin(roll) + ry * Math.cos(roll)) * perspective, z: depth, perspective };
}

export type MotionState = { flow: number; spin: number; boost: number };
export function advanceMotion(state: MotionState, seconds: number) {
  state.flow += seconds * (1 + state.boost * .35);
  state.spin += seconds * (1 + state.boost * .1);
  state.boost *= Math.exp(-seconds * 1.3);
}
