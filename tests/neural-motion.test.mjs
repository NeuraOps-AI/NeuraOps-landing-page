import assert from 'node:assert/strict';
import test from 'node:test';
import { advanceMotion, circuitPoint, CIRCUIT_SECONDS, projectNeuron, revolutionAngle, REVOLUTION_SECONDS } from '../app/neural-motion.ts';

const distance = (a, b) => Math.hypot(...a.map((value, i) => value - b[i]));

test('one travelling neuron visits both full lobes and returns without a jump', () => {
  const frames = CIRCUIT_SECONDS * 40;
  const points = Array.from({ length: frames + 1 }, (_, frame) => circuitPoint(frame / frames));
  assert.ok(distance(points[0], points.at(-1)) < 1e-8);
  for (const [sx, sy] of [[-1, -1], [-1, 1], [1, -1], [1, 1]]) {
    assert.ok(points.some(([x, y]) => x * sx > .3 && y * sy > .07), `Missing lobe quadrant ${sx}, ${sy}`);
  }
  const steps = points.slice(1).map((point, i) => distance(point, points[i]));
  const average = steps.reduce((sum, step) => sum + step, 0) / steps.length;
  assert.ok(Math.min(...steps) > average * .9, 'No local pauses or backward bounces');
  assert.ok(Math.max(...steps) < average * 1.1, 'No jumps between path sections');
  assert.ok(distance(circuitPoint(.9999), circuitPoint(.0001)) < average);
  assert.ok(distance(circuitPoint(-.1), circuitPoint(.9)) < 1e-8);
});

test('the complete symbol turns through every angle and returns to its original pose', () => {
  const start = revolutionAngle(0), end = revolutionAngle(REVOLUTION_SECONDS);
  assert.ok(Math.abs(end - start - Math.PI * 2) < 1e-8);
  let previous = start;
  for (let i = 1; i <= 240; i++) {
    const angle = revolutionAngle(REVOLUTION_SECONDS * i / 240);
    assert.ok(angle > previous, 'Revolution must continue forwards, not rock back and forth');
    previous = angle;
  }
  const point = [.4, .1, .03];
  const front = projectNeuron(point, start, .12), back = projectNeuron(point, revolutionAngle(REVOLUTION_SECONDS / 2), .12);
  const returned = projectNeuron(point, end, .12);
  assert.ok(front.x > 0 && back.x < 0, 'The ribbon must actually turn to its reverse side');
  assert.ok(Math.hypot(front.x - returned.x, front.y - returned.y) < 1e-8);
});

test('click acceleration decays smoothly and a paused clock preserves the exact pose', () => {
  const normal = { flow: 0, spin: 0, boost: 0 }, clicked = { flow: 0, spin: 0, boost: 1 };
  for (let frame = 0; frame < 60; frame++) { advanceMotion(normal, 1 / 30); advanceMotion(clicked, 1 / 30); }
  assert.ok(clicked.flow > normal.flow && clicked.flow < normal.flow * 1.35, 'Click boost stays gentle');
  assert.ok(clicked.spin > normal.spin && clicked.spin < normal.spin * 1.1);
  assert.ok(clicked.boost < .1);
  const frozen = { ...clicked }; advanceMotion(clicked, 0); assert.deepEqual(clicked, frozen);
});
