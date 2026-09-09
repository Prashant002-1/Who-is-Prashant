import P5 from 'p5/core';
import accessibility from 'p5/accessibility';
import { poseAt, stateSymbol } from './line-geometry.js';
import { drawStudy } from './line-renderer.js';

P5.registerAddon(accessibility);

export function startLineStudy(host) {
  if (!host) return;
  const events = new AbortController();
  const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const pause = host.closest('figure').querySelector('[data-study-pause]');
  let ready = false, disposed = false, visible = false, suspended = false, paused = false;
  let elapsed = 0, previousTime = null;
  const running = () => !disposed && visible && !suspended && !document.hidden && !motionPreference.matches && !paused;
  const instance = new P5(p => {
    p.setup = () => {
      p.createCanvas(host.clientWidth, host.clientHeight, p.P2D, host.querySelector('canvas'));
      p.pixelDensity(Math.min(window.devicePixelRatio || 1, 2));
      p.frameRate(40);
      ready = true;
      host.dataset.renderer = 'p5';
      syncMotion();
    };
    p.draw = () => {
      const now = performance.now();
      if (running() && previousTime !== null) elapsed += Math.min(now - previousTime, 100);
      previousTime = running() ? now : null;
      const pose = poseAt(motionPreference.matches ? 0 : elapsed);
      drawStudy(p.drawingContext, p.width, p.height, pose.matrix);
      host.dataset.symmetry = stateSymbol(pose.state);
      host.dataset.phase = pose.settled ? 'settled' : pose.action;
      host.dataset.ready = 'true';
    };
  }, host);
  function syncMotion() {
    previousTime = null;
    if (!ready || disposed) return;
    const active = running();
    host.dataset.motion = active ? 'playing' : 'paused';
    if (active) instance.loop(); else { instance.noLoop(); instance.redraw(); }
    pause.hidden = motionPreference.matches;
    pause.setAttribute('aria-label', paused ? 'Play artwork animation' : 'Pause artwork animation');
    pause.setAttribute('aria-pressed', String(paused));
  }
  pause.addEventListener('click', () => { paused = !paused; syncMotion(); }, { signal: events.signal });
  document.addEventListener('visibilitychange', syncMotion, { signal: events.signal });
  motionPreference.addEventListener('change', syncMotion, { signal: events.signal });
  const intersection = new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting;
    syncMotion();
  }, { threshold: 0 });
  intersection.observe(host);
  const resize = new ResizeObserver(() => {
    if (!ready || disposed) return;
    instance.resizeCanvas(host.clientWidth, host.clientHeight, true);
    if (!running()) instance.redraw();
  });
  resize.observe(host);
  const dispose = () => {
    if (disposed) return;
    disposed = true;
    events.abort();
    resize.disconnect();
    intersection.disconnect();
    instance.remove();
  };
  window.addEventListener('pagehide', event => {
    if (event.persisted) { suspended = true; syncMotion(); } else dispose();
  }, { signal: events.signal });
  window.addEventListener('pageshow', () => { suspended = false; syncMotion(); }, { signal: events.signal });
  return dispose;
}
