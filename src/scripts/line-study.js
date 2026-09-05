import P5 from 'p5/core';
import shape from 'p5/shape';
import color from 'p5/color';
import math from 'p5/math';
import accessibility from 'p5/accessibility';
import { sculptureLines } from './line-geometry.js';

P5.registerAddon(shape);
P5.registerAddon(color);
P5.registerAddon(math);
P5.registerAddon(accessibility);

export function startLineStudy(host) {
  if (!host) return;
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const controller = new AbortController();
  let visible = true;
  let disposed = false;
  let ready = false;
  let time = 0;
  let pointer = [0, 0];
  const target = [0, 0];
  const canvas = host.querySelector('canvas');

  const instance = new P5(p => {
    p.setup = () => {
      p.createCanvas(host.clientWidth, host.clientHeight, p.P2D, canvas);
      p.pixelDensity(Math.min(window.devicePixelRatio || 1, 1.5));
      p.frameRate(18);
      p.noFill();
      ready = true;
      host.dataset.renderer = 'p5';
      updateMotion();
    };
    p.draw = () => {
      p.clear();
      if (!motion.matches) time += Math.min(p.deltaTime, 100) / 1000;
      pointer = pointer.map((value, i) => value + (target[i] - value) * 0.06);
      const scale = Math.min(p.width / 345, p.height / 430);
      p.push();
      p.translate(p.width * 0.5, p.height * 0.5);
      p.scale(scale);
      for (const line of sculptureLines(time, pointer)) {
        const depth = line.points[Math.floor(line.points.length / 2)][2];
        p.stroke(39, 40, 43, line.cross ? 120 - depth * 0.25 : 44);
        p.strokeWeight(line.cross ? 0.65 : 0.5);
        p.beginShape();
        for (const [x, y] of line.points) p.vertex(x, y);
        p.endShape();
      }
      p.pop();
      host.dataset.ready = 'true';
    };
  }, host);

  function updateMotion() {
    if (!ready || disposed) return;
    const running = visible && !document.hidden && !motion.matches;
    host.dataset.motion = running ? 'running' : 'paused';
    if (running) instance.loop();
    else { instance.noLoop(); if (visible && !document.hidden) instance.redraw(); }
  }

  host.addEventListener('pointermove', event => {
    if (event.pointerType !== 'mouse' || motion.matches) return;
    const rect = host.getBoundingClientRect();
    target[0] = (event.clientX - rect.left) / rect.width - 0.5;
    target[1] = (event.clientY - rect.top) / rect.height - 0.5;
  }, { passive: true, signal: controller.signal });
  host.addEventListener('pointerleave', () => { target[0] = 0; target[1] = 0; }, { signal: controller.signal });
  document.addEventListener('visibilitychange', updateMotion, { signal: controller.signal });
  motion.addEventListener('change', updateMotion, { signal: controller.signal });

  const intersection = new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting;
    updateMotion();
  });
  intersection.observe(host);
  const resize = new ResizeObserver(() => {
    if (!ready || disposed) return;
    instance.resizeCanvas(host.clientWidth, host.clientHeight);
    if (!instance.isLooping()) instance.redraw();
  });
  resize.observe(host);

  const dispose = () => {
    if (disposed) return;
    disposed = true;
    controller.abort();
    intersection.disconnect();
    resize.disconnect();
    instance.remove();
  };
  window.addEventListener('pagehide', event => {
    if (event.persisted) instance.noLoop();
    else dispose();
  }, { signal: controller.signal });
  window.addEventListener('pageshow', updateMotion, { signal: controller.signal });
  return dispose;
}
