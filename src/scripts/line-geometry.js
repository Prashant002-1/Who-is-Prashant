// A ruled surface: each line is a relation between two points on one folded plane.
// Shared by the live drawing and its static, no-JavaScript image.
export function surfacePoint(u, v, time = 0, pointer = [0, 0]) {
  const turn = (v - 0.5) * Math.PI * 1.7 + 0.23 * Math.sin(v * 6.28 + time * 0.12);
  const width = 145 * (0.7 + 0.3 * Math.cos(v * 6.28));
  let x = u * width * Math.cos(turn) + 75 * Math.sin(v * 6.28 - 0.4);
  let y = (v - 0.5) * 365 + 18 * Math.cos(u * 2.0 + v * 4.0);
  let z = u * width * Math.sin(turn) + 45 * Math.sin(v * Math.PI);
  const rotation = -0.38 + Math.sin(time * 0.11) * 0.2 + pointer[0] * 0.28;
  const xr = x * Math.cos(rotation) + z * Math.sin(rotation);
  z = -x * Math.sin(rotation) + z * Math.cos(rotation);
  x = xr;
  const tilt = -0.29 + pointer[1] * 0.06;
  const perspective = 750 / (750 + z);
  return [
    (x * Math.cos(tilt) - y * Math.sin(tilt)) * perspective,
    (x * Math.sin(tilt) + y * Math.cos(tilt)) * perspective,
    z,
  ];
}

export function sculptureLines(time = 0, pointer = [0, 0]) {
  const lines = [];
  for (let i = 0; i <= 92; i++) {
    const v = i / 92;
    const points = [];
    for (let j = 0; j <= 26; j++) points.push(surfacePoint(j / 13 - 1, v, time, pointer));
    lines.push({ points, cross: true });
  }
  for (let i = 0; i <= 16; i++) {
    const u = i / 8 - 1;
    const points = [];
    for (let j = 0; j <= 92; j++) points.push(surfacePoint(u, j / 92, time, pointer));
    lines.push({ points, cross: false });
  }
  return lines;
}
