import { test } from 'node:test';
import assert from 'node:assert/strict';
import { order, identity, generators, compose, permutation, surfacePoint, transformPoint,
  stateSymbol, applyMatrix, stateMatrix, transitionMatrix, choreography, timing, poseAt, cycleDuration } from './line-geometry.js';
const states = [false, true].flatMap(flipped => Array.from({ length: order }, (_, turns) => ({ turns, flipped })));
const r = generators.rotate, s = generators.flip;
const near = (a, b, epsilon = 1e-9) => a.forEach((v, i) => assert.ok(Math.abs(v - b[i]) < epsilon, `${a} != ${b}`));
const distance = (a, b) => a.reduce((sum, v, i) => sum + (v - b[i]) ** 2, 0);
const determinant = m => m[0] * (m[4] * m[8] - m[5] * m[7]) - m[1] * (m[3] * m[8] - m[5] * m[6]) + m[2] * (m[3] * m[7] - m[4] * m[6]);

test('ten exact permutations, closure, associativity, and dihedral relations', () => {
  assert.equal(new Set(states.map(state => permutation(state).join(','))).size, 10);
  assert.equal(new Set(states.map(stateSymbol)).size, 10);
  for (const a of states) for (const b of states) {
    const result = compose(a, b);
    assert.ok(states.some(c => c.turns === result.turns && c.flipped === result.flipped));
    assert.deepEqual(permutation(result), permutation(b).map(i => permutation(a)[i]));
    for (const c of states) assert.deepEqual(compose(a, compose(b, c)), compose(compose(a, b), c));
    const point = [27, -19, 56];
    near(transformPoint(transformPoint(point, b), a), transformPoint(point, result));
  }
  let power = identity;
  for (let i = 0; i < order; i++) power = compose(r, power);
  assert.deepEqual(power, identity);
  assert.deepEqual(compose(s, s), identity);
  assert.deepEqual(compose(s, compose(r, s)), { turns: 4, flipped: false });
  assert.notDeepEqual(compose(s, r), compose(r, s));
});

test('all ten actions map the complete two-sided analytic shell onto itself', () => {
  for (const state of states) for (const side of [-1, 1]) {
    for (const t of [0, .055, .17, .43, .71, .93, 1]) for (let j = 0; j < 241; j++) {
      const theta = j / 240 * 2 * Math.PI;
      const destination = (state.flipped ? -theta : theta) + state.turns * 2 * Math.PI / order;
      near(transformPoint(surfacePoint(t, theta, side), state), surfacePoint(t, destination, state.flipped ? -side : side));
    }
  }
  near(transformPoint([23, -61, 42], s), [-23, -61, -42]);
  assert.deepEqual(permutation(s), [0, 4, 3, 2, 1]);
});

test('every frame is a proper rigid rotation, including the middle of each turnover', () => {
  const a = [23, -61, 42], b = [-83, 19, 6];
  for (const state of states) for (const action of ['rotate', 'flip']) {
    near(transitionMatrix(state, action, 0), stateMatrix(state));
    near(transitionMatrix(state, action, 1), stateMatrix(compose(generators[action], state)));
    for (let i = 0; i <= 100; i++) {
      const matrix = transitionMatrix(state, action, i / 100);
      assert.ok(Math.abs(determinant(matrix) - 1) < 1e-12);
      assert.ok(Math.abs(distance(applyMatrix(a, matrix), applyMatrix(b, matrix)) - distance(a, b)) < 1e-8);
      near(applyMatrix([0, 0, 0], matrix), [0, 0, 0]);
    }
  }
});

test('autoplay visits all ten states, settles correctly, and loops continuously', () => {
  let state = identity, elapsed = 0;
  const visited = new Set([stateSymbol(state)]);
  for (const action of choreography) {
    near(poseAt(elapsed).matrix, stateMatrix(state));
    const { move, hold } = timing(action);
    state = compose(generators[action], state);
    const settled = poseAt(elapsed + move + hold / 2);
    assert.equal(settled.settled, true);
    assert.deepEqual(settled.state, state);
    near(settled.matrix, stateMatrix(state));
    visited.add(stateSymbol(state));
    elapsed += move + hold;
  }
  assert.equal(visited.size, 10);
  assert.deepEqual(state, identity);
  assert.equal(elapsed, cycleDuration);
  near(poseAt(cycleDuration - .001).matrix, poseAt(0).matrix);
  near(poseAt(cycleDuration).matrix, poseAt(0).matrix);
});
