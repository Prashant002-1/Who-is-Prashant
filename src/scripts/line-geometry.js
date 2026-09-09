// A faithful D5 action by proper rotations in R3.
// r turns 72° about z; s turns 180° about y. On z=0, s acts as a reflection.
export const order = 5;
export const turnAngle = Math.PI * 2 / order;
const mod = n => ((n % order) + order) % order;
export const identity = Object.freeze({ turns: 0, flipped: false });
export const generators = Object.freeze({
  rotate: Object.freeze({ turns: 1, flipped: false }),
  flip: Object.freeze({ turns: 0, flipped: true }),
});
export function compose(left, right) {
  return {
    turns: mod(left.turns + (left.flipped ? -right.turns : right.turns)),
    flipped: left.flipped !== right.flipped,
  };
}
export const lobeImage = (state, index) => mod(state.turns + (state.flipped ? -index : index));
export const permutation = state => Array.from({ length: order }, (_, i) => lobeImage(state, i));
export function stateSymbol(state) {
  const powers = ['', '', '²', '³', '⁴'];
  return ((state.turns ? 'r' + powers[state.turns] : '') + (state.flipped ? 's' : '')) || 'e';
}

// Matching upper and lower sheets make a closed, two-sided shell.
// cos(5θ) is invariant under θ -> θ + 2π/5 and θ -> -θ.
export function surfacePoint(t, theta, side = 1) {
  const fold = Math.cos(order * theta);
  const radius = 122 * t * (1 + .18 * fold);
  const height = side * (38 * (1 - t * t) + 20 * Math.sin(Math.PI * t) * fold);
  return [radius * Math.sin(theta), -radius * Math.cos(theta), height];
}
const rotationZ = angle => {
  const c = Math.cos(angle), s = Math.sin(angle);
  return [c, -s, 0, s, c, 0, 0, 0, 1];
};
const rotationY = angle => {
  const c = Math.cos(angle), s = Math.sin(angle);
  return [c, 0, s, 0, 1, 0, -s, 0, c];
};
const multiply = (a, b) => Array.from({ length: 9 }, (_, i) => {
  const row = Math.floor(i / 3), col = i % 3;
  return a[row * 3] * b[col] + a[row * 3 + 1] * b[3 + col] + a[row * 3 + 2] * b[6 + col];
});
export function stateMatrix(state) {
  const matrix = rotationZ(state.turns * turnAngle);
  if (state.flipped) for (let i = 0; i < 9; i++) if (i % 3 !== 1) matrix[i] *= -1;
  return matrix;
}
export function applyMatrix([x, y, z], matrix) {
  return [matrix[0] * x + matrix[1] * y + matrix[2] * z,
    matrix[3] * x + matrix[4] * y + matrix[5] * z,
    matrix[6] * x + matrix[7] * y + matrix[8] * z];
}
export const transformPoint = (point, state) => applyMatrix(point, stateMatrix(state));

// Every intermediate pose is also rigid: R_axis(t) times the starting pose.
// Only the endpoints are claimed to be elements of the shell's D5 subgroup.
export function transitionMatrix(state, action, progress) {
  if (progress <= 0) return stateMatrix(state);
  if (progress >= 1) return stateMatrix(compose(generators[action], state));
  const motion = action === 'flip' ? rotationY(Math.PI * progress) : rotationZ(turnAngle * progress);
  return multiply(motion, stateMatrix(state));
}
export function project([x, y, z]) {
  const pitch = .60, tilt = -.17;
  const yView = y * Math.cos(pitch) - z * Math.sin(pitch);
  return [x * Math.cos(tilt) - yView * Math.sin(tilt),
    x * Math.sin(tilt) + yView * Math.cos(tilt),
    y * Math.sin(pitch) + z * Math.cos(pitch)];
}

// One ten-step circuit visits every D5 element and returns exactly to e.
export const choreography = ['rotate', 'rotate', 'rotate', 'rotate', 'flip',
  'rotate', 'rotate', 'rotate', 'rotate', 'flip'];
export const timing = action => action === 'flip' ? { move: 5200, hold: 700 } : { move: 3800, hold: 400 };
export const cycleDuration = choreography.reduce((sum, action) => sum + timing(action).move + timing(action).hold, 0);
export function poseAt(milliseconds) {
  let time = ((milliseconds % cycleDuration) + cycleDuration) % cycleDuration;
  let state = identity;
  for (const action of choreography) {
    const { move, hold } = timing(action);
    if (time < move + hold) {
      const t = Math.min(time / move, 1);
      const progress = t * t * t * (t * (t * 6 - 15) + 10);
      const settled = t === 1;
      return { matrix: transitionMatrix(state, action, progress),
        state: settled ? compose(generators[action], state) : state, action, settled };
    }
    time -= move + hold;
    state = compose(generators[action], state);
  }
}
