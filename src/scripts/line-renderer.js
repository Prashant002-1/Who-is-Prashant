import { order, turnAngle, surfacePoint, applyMatrix, project } from './line-geometry.js';

// Persistent material colors, one for each lobe, on both sides of the shell.
export const palette = ['#C83D50', '#A76C12', '#087A76', '#346BA8', '#7552AA'];
const curves = [];
for (let lobe = 0; lobe < order; lobe++) {
  for (const side of [-1, 1]) {
    for (let ring = 0; ring < 31; ring++) {
      // Both sheets share the rim; draw that single material edge only once.
      if (side === -1 && ring === 30) continue;
      const t = .055 + ring / 30 * .945;
      curves.push({ lobe, ring, edge: ring === 30, rib: false,
        points: Array.from({ length: 33 }, (_, i) => surfacePoint(t, (lobe - .5 + i / 32) * turnAngle, side)) });
    }
    curves.push({ lobe, ring: 0, edge: false, rib: true,
      points: Array.from({ length: 41 }, (_, i) => surfacePoint(i / 40, lobe * turnAngle, side)) });
  }
}
export function sceneCurves(matrix, compact = false) {
  return curves.filter(curve => !compact || curve.ring % 2 === 0 || curve.rib || curve.edge).map(curve => {
    const points = curve.points.map(point => project(applyMatrix(point, matrix)));
    const depth = points.reduce((sum, point) => sum + point[2], 0) / points.length;
    const front = Math.max(0, Math.min(1, (depth + 80) / 160));
    return { ...curve, points, depth, color: palette[curve.lobe],
      opacity: curve.edge ? .95 : curve.rib ? .72 : .25 + front * .58,
      weight: curve.edge ? 1.15 : curve.rib ? 1 : .75 };
  }).sort((a, b) => a.depth - b.depth);
}
export function drawStudy(context, width, height, matrix) {
  const scale = Math.min(width / 358, height / 305);
  context.clearRect(0, 0, width, height);
  context.save();
  context.translate(width / 2, height / 2);
  context.scale(scale, scale);
  context.lineJoin = 'round';
  context.lineCap = 'round';
  for (const curve of sceneCurves(matrix, width < 200)) {
    context.strokeStyle = curve.color;
    context.globalAlpha = curve.opacity;
    // Keep colored strands legible in the small phone-sized artwork.
    context.lineWidth = curve.weight * (width < 200 ? .82 : 1) / scale;
    context.beginPath();
    curve.points.forEach(([x, y], index) => {
      if (index) context.lineTo(x, y); else context.moveTo(x, y);
    });
    context.stroke();
  }
  context.restore();
}
