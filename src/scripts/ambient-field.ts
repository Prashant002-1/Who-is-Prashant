type InkSide = -1 | 1;

type InkPart = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  m: number;
  cr: number;
  cg: number;
  cb: number;
  ph: number;
  w1: number;
  pid: number;
  side: InkSide;
  cool: number;
  castJ: number;
  castT: number;
};

type PlacedPool = {
  x: number;
  y: number;
  radius: number;
  side: InkSide;
};

const DRIFT = 28;
const DRAG = 3.8;
const POOL_K = 10.5;
const HOME_K = 0.68;
const TENSION = 235;
const CROWD = 540;
const DIFFUSE = 1.5;
const PUSH = 10400;
const REACH = 105;
const TAU_ENERGY = 0.75;
const FIELD_THRESHOLD = 0.5;
const ABSORB_SECONDS = 1.15;

// Four pigment families, with enough variation to make mixing visible
// without turning the field into an unrelated rainbow.
const PIGMENTS = [
  [0.79, 0.20, 0.28],
  [0.38, 0.25, 0.69],
  [0.03, 0.46, 0.43],
  [0.12, 0.34, 0.65],
  [0.82, 0.36, 0.08],
  [0.65, 0.17, 0.42],
  [0.32, 0.49, 0.12],
  [0.10, 0.48, 0.62],
  [0.56, 0.37, 0.08],
  [0.29, 0.17, 0.36],
  [0.04, 0.29, 0.21],
] as const;

const hash = (value: number) => {
  const result = Math.sin(value) * 43758.5453123;
  return result - Math.floor(result);
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const damp = (current: number, target: number, halfLife: number, delta: number) =>
  target + (current - target) * Math.pow(2, -delta / halfLife);

const clamp01 = (value: number) => clamp(value, 0, 1);

const ok1 = [0, 0, 0];
const ok2 = [0, 0, 0];
const rgb1 = [0, 0, 0];

function rgbToOklab(red: number, green: number, blue: number, output: number[]) {
  const l = Math.cbrt(0.4122214708 * red + 0.5363325363 * green + 0.0514459929 * blue);
  const m = Math.cbrt(0.2119034982 * red + 0.6806995451 * green + 0.1073969566 * blue);
  const s = Math.cbrt(0.0883024619 * red + 0.2817188376 * green + 0.6299787005 * blue);

  output[0] = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  output[1] = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  output[2] = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
}

function oklabToRgb(lightness: number, a: number, b: number, output: number[]) {
  const lBase = lightness + 0.3963377774 * a + 0.2158037573 * b;
  const mBase = lightness - 0.1055613458 * a - 0.0638541728 * b;
  const sBase = lightness - 0.0894841775 * a - 1.291485548 * b;
  const l = lBase * lBase * lBase;
  const m = mBase * mBase * mBase;
  const s = sBase * sBase * sBase;

  output[0] = 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  output[1] = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  output[2] = -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s;
}

function createShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;

  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return shader;

  gl.deleteShader(shader);
  return null;
}

function createProgram(gl: WebGLRenderingContext, vertexSource: string, fragmentSource: string) {
  const vertex = createShader(gl, gl.VERTEX_SHADER, vertexSource);
  const fragment = createShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
  if (!vertex || !fragment) return null;

  const program = gl.createProgram();
  if (!program) return null;

  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  gl.deleteShader(vertex);
  gl.deleteShader(fragment);

  if (gl.getProgramParameter(program, gl.LINK_STATUS)) return program;

  gl.deleteProgram(program);
  return null;
}

function measureSideLane(canvas: HTMLCanvasElement, viewportWidth: number) {
  const desiredLane = viewportWidth < 700
    ? clamp(viewportWidth * 0.12, 42, 58)
    : clamp(viewportWidth * 0.17, 130, 240);
  const content = document.querySelector<HTMLElement>('#hero .hero-layout');
  if (!content) return desiredLane;

  const canvasRect = canvas.getBoundingClientRect();
  const contentRect = content.getBoundingClientRect();
  const leftGutter = contentRect.left - canvasRect.left;
  const rightGutter = canvasRect.right - contentRect.right;
  const safeGutter = Math.max(16, Math.min(leftGutter, rightGutter) - 6);
  return Math.min(desiredLane, safeGutter);
}

function renderStaticFallback(canvas: HTMLCanvasElement) {
  const context = canvas.getContext('2d');
  if (!context) return;

  const ratio = Math.min(window.devicePixelRatio || 1, 1.25);
  const width = Math.max(1, Math.round(window.innerWidth * ratio));
  const height = Math.max(1, Math.round(window.innerHeight * ratio));
  const lane = measureSideLane(canvas, window.innerWidth) * ratio;

  canvas.width = width;
  canvas.height = height;
  canvas.dataset.renderer = 'canvas2d';
  context.clearRect(0, 0, width, height);

  const pools = [
    { side: -1, x: 0.30, y: 0.18, r: 0.34, color: 0 },
    { side: -1, x: 0.56, y: 0.56, r: 0.24, color: 2 },
    { side: -1, x: 0.18, y: 0.84, r: 0.30, color: 3 },
    { side: -1, x: 0.72, y: 0.72, r: 0.17, color: 6 },
    { side: -1, x: 0.78, y: 0.34, r: 0.11, color: 8 },
    { side: -1, x: 0.44, y: 0.67, r: 0.09, color: 9 },
    { side: -1, x: 0.66, y: 0.93, r: 0.07, color: 10 },
    { side: 1, x: 0.34, y: 0.14, r: 0.29, color: 1 },
    { side: 1, x: 0.58, y: 0.48, r: 0.25, color: 0 },
    { side: 1, x: 0.24, y: 0.82, r: 0.34, color: 4 },
    { side: 1, x: 0.72, y: 0.66, r: 0.16, color: 7 },
    { side: 1, x: 0.78, y: 0.30, r: 0.10, color: 10 },
    { side: 1, x: 0.43, y: 0.61, r: 0.08, color: 8 },
    { side: 1, x: 0.69, y: 0.92, r: 0.07, color: 9 },
  ] as const;

  pools.forEach((pool) => {
    const pigment = PIGMENTS[pool.color];
    const x = pool.side < 0 ? pool.x * lane : width - pool.x * lane;
    const radius = pool.r * lane;
    context.fillStyle = `rgba(${Math.round(pigment[0] * 255)}, ${Math.round(pigment[1] * 255)}, ${Math.round(pigment[2] * 255)}, 0.9)`;
    context.beginPath();
    context.arc(x, pool.y * height, radius, 0, Math.PI * 2);
    context.fill();
  });
}

export function startAmbientField(element: HTMLElement | null) {
  if (!(element instanceof HTMLCanvasElement)) return;

  const canvas = element;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const gl = canvas.getContext('webgl', {
    alpha: true,
    antialias: false,
    depth: false,
    stencil: false,
    premultipliedAlpha: true,
    powerPreference: 'low-power',
  });

  if (!gl) {
    renderStaticFallback(canvas);
    return;
  }

  const splatProgram = createProgram(
    gl,
    `
      attribute vec2 a_position;
      attribute vec2 a_local;
      attribute vec3 a_color;
      uniform vec2 u_resolution;
      varying vec2 v_local;
      varying vec3 v_color;

      void main() {
        v_local = a_local;
        v_color = a_color;
        vec2 clip = (a_position / u_resolution) * 2.0 - 1.0;
        gl_Position = vec4(clip.x, -clip.y, 0.0, 1.0);
      }
    `,
    `
      precision mediump float;
      varying vec2 v_local;
      varying vec3 v_color;
      uniform float u_gain;

      void main() {
        float field = exp(-dot(v_local, v_local)) * u_gain;
        gl_FragColor = vec4(v_color * field, field);
      }
    `,
  );

  const inkProgram = createProgram(
    gl,
    `
      attribute vec2 a_clip;
      varying vec2 v_uv;

      void main() {
        v_uv = a_clip * 0.5 + 0.5;
        gl_Position = vec4(a_clip, 0.0, 1.0);
      }
    `,
    `
      precision mediump float;
      varying vec2 v_uv;
      uniform sampler2D u_texture;
      uniform float u_threshold;

      void main() {
        vec4 sampleValue = texture2D(u_texture, v_uv);
        float field = sampleValue.a;
        float antialias = u_threshold * 0.085;
        float alpha = smoothstep(u_threshold - antialias, u_threshold + antialias, field) * 0.94;
        vec3 pigment = sampleValue.rgb / max(field, 0.0001);
        gl_FragColor = vec4(pigment * alpha, alpha);
      }
    `,
  );

  if (!splatProgram || !inkProgram) {
    renderStaticFallback(canvas);
    return;
  }

  const quadBuffer = gl.createBuffer();
  const splatBuffer = gl.createBuffer();
  const framebuffer = gl.createFramebuffer();
  const framebufferTexture = gl.createTexture();
  if (!quadBuffer || !splatBuffer || !framebuffer || !framebufferTexture) {
    renderStaticFallback(canvas);
    return;
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);

  const splatResolution = gl.getUniformLocation(splatProgram, 'u_resolution');
  const splatGain = gl.getUniformLocation(splatProgram, 'u_gain');
  const inkTexture = gl.getUniformLocation(inkProgram, 'u_texture');
  const inkThreshold = gl.getUniformLocation(inkProgram, 'u_threshold');
  const positionLocation = gl.getAttribLocation(splatProgram, 'a_position');
  const localLocation = gl.getAttribLocation(splatProgram, 'a_local');
  const colorLocation = gl.getAttribLocation(splatProgram, 'a_color');
  const clipLocation = gl.getAttribLocation(inkProgram, 'a_clip');

  if (
    splatResolution === null ||
    splatGain === null ||
    inkTexture === null ||
    inkThreshold === null ||
    positionLocation < 0 ||
    localLocation < 0 ||
    colorLocation < 0 ||
    clipLocation < 0
  ) {
    renderStaticFallback(canvas);
    return;
  }

  canvas.dataset.renderer = 'webgl-ink';

  let parts: InkPart[] = [];
  let poolCount = 0;
  let homeX = new Float64Array(0);
  let homeY = new Float64Array(0);
  let poolCenterX = new Float64Array(0);
  let poolCenterY = new Float64Array(0);
  let poolMembers = new Float64Array(0);
  let width = 0;
  let height = 0;
  let dpr = 1;
  let laneWidth = 180;
  let fieldWidth = 0;
  let fieldHeight = 0;
  let textureType = gl.UNSIGNED_BYTE;
  let gain = 0.13;
  let splatData = new Float32Array(0);
  let frameRequest = 0;
  let visible = true;
  let lastFrame = performance.now();
  const startTime = lastFrame;
  const neighborGrid = new Map<number, number[]>();
  const poolContacts = new Map<string, number>();
  let absorptionCount = 0;

  let pointerX = -10000;
  let pointerY = -10000;
  let targetX = -10000;
  let targetY = -10000;
  let pointerDirectionX = 0;
  let pointerDirectionY = 0;
  let pointerEnergy = 0;
  let hasPointer = false;

  const halfFloat = gl.getExtension('OES_texture_half_float');
  const halfFloatLinear = gl.getExtension('OES_texture_half_float_linear');
  gl.getExtension('EXT_color_buffer_half_float');
  if (halfFloat && halfFloatLinear) {
    textureType = halfFloat.HALF_FLOAT_OES;
    gain = 1;
  }

  function throwInk() {
    parts = [];
    poolCount = 0;
    const placed: PlacedPool[] = [];
    const homesX: number[] = [];
    const homesY: number[] = [];
    const compact = width < 700;
    const scale = compact
      ? clamp(width / 800, 0.42, 0.58)
      : clamp(Math.min(width / 1440, height / 900), 0.68, 1.08);
    const classes = [
      { count: 1, low: 104 * scale, high: 146 * scale, apart: 168 * scale, particles: 9 },
      { count: 2, low: 58 * scale, high: 88 * scale, apart: 105 * scale, particles: 6 },
      { count: 5, low: 26 * scale, high: 48 * scale, apart: 52 * scale, particles: 4 },
      { count: 3, low: 10 * scale, high: 18 * scale, apart: 24 * scale, particles: 2 },
    ];

    let seed = 0;
    ([-1, 1] as InkSide[]).forEach((side) => {
      classes.forEach((poolClass, classIndex) => {
        let made = 0;
        let tries = 0;

        while (made < poolClass.count && tries < poolClass.count * 100) {
          tries += 1;
          seed += 1;
          const radius = poolClass.low + hash(seed * 74.7) * (poolClass.high - poolClass.low);
          const visibleLimit = Math.max(8, laneWidth - (compact ? 4 : 8));
          const outerCenter = -radius * 0.72;
          const innerCenter = visibleLimit - radius * 0.95;
          const localX =
            Math.min(outerCenter, innerCenter) +
            hash(seed * 127.1) * Math.abs(innerCenter - outerCenter);
          const x = side < 0 ? localX : width - localX;
          const y = 22 + radius + hash(seed * 311.7) * Math.max(1, height - 44 - radius * 2);

          let crowded = false;
          for (let index = 0; index < placed.length; index += 1) {
            const previous = placed[index];
            if (previous.side !== side) continue;
            const dx = previous.x - x;
            const dy = previous.y - y;
            const needed = Math.max(poolClass.apart, (previous.radius + radius) * 0.78);
            if (dx * dx + dy * dy < needed * needed) {
              crowded = true;
              break;
            }
          }
          if (crowded) continue;

          placed.push({ x, y, radius, side });
          const particleCount = poolClass.particles;
          const pigmentIndex =
            classIndex === 0
              ? side < 0
                ? 2
                : 1
              : (seed + classIndex * 2 + (side > 0 ? 1 : 0)) % PIGMENTS.length;
          const pigment = PIGMENTS[pigmentIndex];
          const initialAngle = hash(seed * 63.5) * Math.PI * 2;
          const poolId = poolCount;
          poolCount += 1;
          homesX.push(x);
          homesY.push(y);

          for (let particle = 0; particle < particleCount; particle += 1) {
            const isCenter = particle === 0 || particleCount === 1;
            const angle =
              initialAngle +
              particle * 2.3999632297 +
              (hash(seed * 9.3 + particle) - 0.5) * 0.65;
            const distance = isCenter ? 0 : radius * (0.28 + hash(seed * 4.9 + particle) * 0.36);
            const variedRadius = isCenter
              ? radius * (0.45 + hash(seed * 2.7 + particle) * 0.07)
              : radius * (0.27 + hash(seed * 6.7 + particle) * 0.21);

            parts.push({
              x: x + Math.cos(angle) * distance,
              y: y + Math.sin(angle) * distance,
              vx: (hash(seed * 3.1 + particle) - 0.5) * 8,
              vy: (hash(seed * 5.7 + particle) - 0.5) * 8,
              r: variedRadius,
              m: Math.max(0.55, (variedRadius * variedRadius) / 500),
              cr: pigment[0],
              cg: pigment[1],
              cb: pigment[2],
              ph: hash(seed * 12.9 + particle) * Math.PI * 2,
              w1: 0.05 + hash(seed * 1.7 + particle) * 0.08,
              pid: poolId,
              side,
              cool: -10,
              castJ: -1,
              castT: 0,
            });
          }

          made += 1;
        }
      });
    });

    homeX = Float64Array.from(homesX);
    homeY = Float64Array.from(homesY);
    poolCenterX = new Float64Array(poolCount);
    poolCenterY = new Float64Array(poolCount);
    poolMembers = new Float64Array(poolCount);
    poolContacts.clear();
    absorptionCount = 0;
    canvas.dataset.particles = String(parts.length);
    canvas.dataset.pools = String(poolCount);
    canvas.dataset.pigments = String(PIGMENTS.length);
    canvas.dataset.activePools = String(poolCount);
    canvas.dataset.absorptions = '0';
  }

  function sizeField() {
    fieldWidth = Math.max(2, Math.floor(width));
    fieldHeight = Math.max(2, Math.floor(height));

    gl.bindTexture(gl.TEXTURE_2D, framebufferTexture);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      fieldWidth,
      fieldHeight,
      0,
      gl.RGBA,
      textureType,
      null,
    );
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
    gl.framebufferTexture2D(
      gl.FRAMEBUFFER,
      gl.COLOR_ATTACHMENT0,
      gl.TEXTURE_2D,
      framebufferTexture,
      0,
    );

    if (
      textureType !== gl.UNSIGNED_BYTE &&
      gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE
    ) {
      textureType = gl.UNSIGNED_BYTE;
      gain = 0.13;
      gl.bindTexture(gl.TEXTURE_2D, framebufferTexture);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        fieldWidth,
        fieldHeight,
        0,
        gl.RGBA,
        textureType,
        null,
      );
      gl.framebufferTexture2D(
        gl.FRAMEBUFFER,
        gl.COLOR_ATTACHMENT0,
        gl.TEXTURE_2D,
        framebufferTexture,
        0,
      );
    }

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  }

  function resize() {
    const nextWidth = canvas.clientWidth;
    const nextHeight = canvas.clientHeight;
    if (nextWidth === 0 || nextHeight === 0) return false;
    if (nextWidth === width && nextHeight === height) return true;

    width = nextWidth;
    height = nextHeight;
    dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    laneWidth = measureSideLane(canvas, width);
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    sizeField();
    throwInk();
    return true;
  }

  function simulate(time: number, delta: number) {
    neighborGrid.clear();
    const cellSize = 160;
    const touchingPools = new Set<string>();

    for (let index = 0; index < parts.length; index += 1) {
      const part = parts[index];
      const key = ((part.x / cellSize) | 0) * 100003 + ((part.y / cellSize) | 0);
      const cell = neighborGrid.get(key);
      if (cell) cell.push(index);
      else neighborGrid.set(key, [index]);
    }

    poolCenterX.fill(0);
    poolCenterY.fill(0);
    poolMembers.fill(0);
    for (let index = 0; index < parts.length; index += 1) {
      const part = parts[index];
      if (part.castT > 0) continue;
      poolCenterX[part.pid] += part.x;
      poolCenterY[part.pid] += part.y;
      poolMembers[part.pid] += 1;
    }

    const reachSquared = REACH * REACH;

    for (let index = 0; index < parts.length; index += 1) {
      const part = parts[index];
      let accelerationX = (Math.cos(part.ph + time * part.w1 * Math.PI * 2) * DRIFT) / part.m;
      let accelerationY = (Math.sin(part.ph * 1.7 + time * part.w1 * 5.1) * DRIFT) / part.m;

      if (part.castT <= 0 && poolMembers[part.pid] > 0) {
        accelerationX += (poolCenterX[part.pid] / poolMembers[part.pid] - part.x) * POOL_K;
        accelerationY += (poolCenterY[part.pid] / poolMembers[part.pid] - part.y) * POOL_K;
        accelerationX += (homeX[part.pid] - part.x) * HOME_K;
        accelerationY += (homeY[part.pid] - part.y) * HOME_K;
      }

      const cellX = (part.x / cellSize) | 0;
      const cellY = (part.y / cellSize) | 0;
      for (let gridX = cellX - 1; gridX <= cellX + 1; gridX += 1) {
        for (let gridY = cellY - 1; gridY <= cellY + 1; gridY += 1) {
          const neighbors = neighborGrid.get(gridX * 100003 + gridY);
          if (!neighbors) continue;

          for (let neighborIndex = 0; neighborIndex < neighbors.length; neighborIndex += 1) {
            const otherIndex = neighbors[neighborIndex];
            if (otherIndex <= index) continue;
            const other = parts[otherIndex];
            if (other.side !== part.side) continue;

            const dx = other.x - part.x;
            const dy = other.y - part.y;
            const distanceSquared = dx * dx + dy * dy;
            const combinedRadius = part.r + other.r;
            if (distanceSquared > combinedRadius * combinedRadius * 1.69 || distanceSquared < 0.01) continue;

            const distance = Math.sqrt(distanceSquared);
            const unitX = dx / distance;
            const unitY = dy / distance;

            if (distance < combinedRadius * 0.34) {
              const force = CROWD * (1 - distance / (combinedRadius * 0.34));
              accelerationX -= (unitX * force) / part.m;
              accelerationY -= (unitY * force) / part.m;
              other.vx += (unitX * force * delta) / other.m;
              other.vy += (unitY * force * delta) / other.m;
            } else if (
              part.pid !== other.pid &&
              distance > combinedRadius * 0.5 &&
              distance < combinedRadius * 1.3
            ) {
              const force = TENSION * (1 - (distance - combinedRadius * 0.5) / (combinedRadius * 0.8));
              accelerationX += (unitX * force) / part.m;
              accelerationY += (unitY * force) / part.m;
              other.vx -= (unitX * force * delta) / other.m;
              other.vy -= (unitY * force * delta) / other.m;
            }

            if (distance < combinedRadius) {
              if (
                part.pid !== other.pid &&
                part.castT <= 0 &&
                other.castT <= 0
              ) {
                const firstPool = Math.min(part.pid, other.pid);
                const secondPool = Math.max(part.pid, other.pid);
                touchingPools.add(`${firstPool}:${secondPool}`);
              }

              const redDelta = other.cr - part.cr;
              const greenDelta = other.cg - part.cg;
              const blueDelta = other.cb - part.cb;
              if (redDelta * redDelta + greenDelta * greenDelta + blueDelta * blueDelta > 0.006) {
                const mixAmount = Math.min(0.4, DIFFUSE * (1 - distance / combinedRadius) * delta);
                const weight =
                  (other.r * other.r) / (part.r * part.r + other.r * other.r);
                rgbToOklab(part.cr, part.cg, part.cb, ok1);
                rgbToOklab(other.cr, other.cg, other.cb, ok2);

                for (let channel = 0; channel < 3; channel += 1) {
                  const channelDelta = ok2[channel] - ok1[channel];
                  ok1[channel] += channelDelta * mixAmount * weight * 2;
                  ok2[channel] -= channelDelta * mixAmount * (1 - weight) * 2;
                }

                oklabToRgb(ok1[0], ok1[1], ok1[2], rgb1);
                part.cr = clamp01(rgb1[0]);
                part.cg = clamp01(rgb1[1]);
                part.cb = clamp01(rgb1[2]);
                oklabToRgb(ok2[0], ok2[1], ok2[2], rgb1);
                other.cr = clamp01(rgb1[0]);
                other.cg = clamp01(rgb1[1]);
                other.cb = clamp01(rgb1[2]);
              }
            }
          }
        }
      }

      if (hasPointer && pointerEnergy > 0.02) {
        const relativeX = part.x - pointerX;
        const relativeY = part.y - pointerY;
        const relativeDistanceSquared = relativeX * relativeX + relativeY * relativeY;

        if (relativeDistanceSquared < reachSquared * 9) {
          const influence = pointerEnergy * Math.exp(-relativeDistanceSquared / reachSquared);
          const inverseDistance = 1 / Math.sqrt(relativeDistanceSquared + 1);
          const directionLength = Math.hypot(pointerDirectionX, pointerDirectionY);

          if (directionLength > 0.35) {
            const normalX = -pointerDirectionY / directionLength;
            const normalY = pointerDirectionX / directionLength;
            const signedSide = relativeX * normalX + relativeY * normalY >= 0 ? 1 : -1;
            const bladeForce = influence * PUSH;
            accelerationX += normalX * signedSide * bladeForce;
            accelerationY += normalY * signedSide * bladeForce;
            accelerationX += relativeX * inverseDistance * bladeForce * 0.16;
            accelerationY += relativeY * inverseDistance * bladeForce * 0.16;
          } else {
            accelerationX += relativeX * inverseDistance * influence * PUSH * 0.4;
            accelerationY += relativeY * inverseDistance * influence * PUSH * 0.4;
          }

          if (influence > 0.5 && time - part.cool > 1.6 && poolMembers[part.pid] > 2) {
            part.cool = time;
            if (hash(index * 41.7 + time) < 0.36) {
              let closest = -1;
              let closestDistance = Number.POSITIVE_INFINITY;

              for (let otherIndex = 0; otherIndex < parts.length; otherIndex += 1) {
                if (otherIndex === index) continue;
                const other = parts[otherIndex];
                if (other.side !== part.side || other.pid === part.pid) continue;
                const dx = other.x - part.x;
                const dy = other.y - part.y;
                if (dx * relativeX + dy * relativeY < 0) continue;
                const distance = dx * dx + dy * dy;
                if (distance < 4900) continue;
                if (distance < closestDistance) {
                  closestDistance = distance;
                  closest = otherIndex;
                }
              }

              if (closest >= 0 && closestDistance < 460 * 460) {
                part.castJ = closest;
                part.castT = 2.8;
              }
            }
          }
        }
      }

      if (part.castT > 0) {
        part.castT -= delta;
        const destination = parts[part.castJ];
        if (destination && destination.side === part.side) {
          const dx = destination.x - part.x;
          const dy = destination.y - part.y;
          const distance = Math.sqrt(dx * dx + dy * dy) + 1;
          if (distance < (part.r + destination.r) * 0.7 || part.castT <= 0) {
            part.castT = 0;
            part.pid = destination.pid;
          } else {
            const pull = 300 / part.m;
            accelerationX += (dx / distance) * pull;
            accelerationY += (dy / distance) * pull;
          }
        } else {
          part.castT = 0;
        }
      }

      const drag = Math.exp(-delta * DRAG);
      part.vx = (part.vx + accelerationX * delta) * drag;
      part.vy = (part.vy + accelerationY * delta) * drag;
      const speed = Math.hypot(part.vx, part.vy);
      if (speed > 260) {
        part.vx *= 260 / speed;
        part.vy *= 260 / speed;
      }

      part.x += part.vx * delta;
      part.y += part.vy * delta;

      const innerLaneWall = Math.max(8, laneWidth - 4);
      const bodyInset = part.r * 0.9;
      const leftWall = part.side < 0 ? -part.r * 0.85 : width - innerLaneWall;
      const rightWall = part.side < 0
        ? innerLaneWall - bodyInset
        : width + part.r * 0.85;
      const adjustedLeftWall = part.side < 0
        ? leftWall
        : leftWall + bodyInset;
      const topWall = -part.r * 0.35;
      const bottomWall = height + part.r * 0.35;
      if (part.x < adjustedLeftWall) part.vx += (adjustedLeftWall - part.x) * 6 * delta;
      if (part.x > rightWall) part.vx -= (part.x - rightWall) * 6 * delta;
      if (part.y < topWall) part.vy += (topWall - part.y) * 6 * delta;
      if (part.y > bottomWall) part.vy -= (part.y - bottomWall) * 6 * delta;
    }

    // Pool placement is fixed by the hash above. Contact duration determines
    // when a smaller pool is absorbed, so the field varies but remains repeatable.
    for (const [pair, contactTime] of poolContacts) {
      if (touchingPools.has(pair)) continue;
      const cooled = contactTime - delta * 1.8;
      if (cooled <= 0) poolContacts.delete(pair);
      else poolContacts.set(pair, cooled);
    }

    for (const pair of touchingPools) {
      const separator = pair.indexOf(':');
      const firstPool = Number(pair.slice(0, separator));
      const secondPool = Number(pair.slice(separator + 1));
      const firstCount = poolMembers[firstPool] || 0;
      const secondCount = poolMembers[secondPool] || 0;
      if (firstCount === 0 || secondCount === 0) {
        poolContacts.delete(pair);
        continue;
      }

      const contactTime = (poolContacts.get(pair) || 0) + delta;
      poolContacts.set(pair, contactTime);
      const absorbAfter = ABSORB_SECONDS + hash(firstPool * 37.1 + secondPool * 91.7) * 0.7;
      const smallerCount = Math.min(firstCount, secondCount);
      const largerCount = Math.max(firstCount, secondCount);
      if (contactTime < absorbAfter || smallerCount > largerCount * 0.72) continue;

      const winner = firstCount >= secondCount ? firstPool : secondPool;
      const absorbed = winner === firstPool ? secondPool : firstPool;
      const totalCount = firstCount + secondCount;
      const mergedHomeX =
        (homeX[firstPool] * firstCount + homeX[secondPool] * secondCount) / totalCount;
      const mergedHomeY =
        (homeY[firstPool] * firstCount + homeY[secondPool] * secondCount) / totalCount;

      homeX[winner] = mergedHomeX;
      homeY[winner] = mergedHomeY;
      homeX[absorbed] = mergedHomeX;
      homeY[absorbed] = mergedHomeY;
      poolMembers[winner] = totalCount;
      poolMembers[absorbed] = 0;
      for (let index = 0; index < parts.length; index += 1) {
        const part = parts[index];
        if (part.pid !== absorbed || part.castT > 0) continue;
        part.pid = winner;
        part.castJ = -1;
        part.castT = 0;
        part.cool = time;
      }

      absorptionCount += 1;
      canvas.dataset.absorptions = String(absorptionCount);
      canvas.dataset.activePools = String(
        new Set(parts.filter((part) => part.castT <= 0).map((part) => part.pid)).size,
      );
      for (const activePair of poolContacts.keys()) {
        const pools = activePair.split(':').map(Number);
        if (pools.includes(absorbed) || pools.includes(winner)) poolContacts.delete(activePair);
      }
    }
  }

  function render() {
    const floatsPerParticle = 6 * 7;
    if (splatData.length < parts.length * floatsPerParticle) {
      splatData = new Float32Array(parts.length * floatsPerParticle);
    }

    let offset = 0;
    for (let index = 0; index < parts.length; index += 1) {
      const part = parts[index];
      const spread = part.r * 3;
      const x0 = part.x - spread;
      const x1 = part.x + spread;
      const y0 = part.y - spread;
      const y1 = part.y + spread;

      const vertices = [
        x0, y0, -3, -3,
        x1, y0, 3, -3,
        x0, y1, -3, 3,
        x1, y0, 3, -3,
        x1, y1, 3, 3,
        x0, y1, -3, 3,
      ];

      for (let vertex = 0; vertex < 6; vertex += 1) {
        const source = vertex * 4;
        splatData[offset++] = vertices[source];
        splatData[offset++] = vertices[source + 1];
        splatData[offset++] = vertices[source + 2];
        splatData[offset++] = vertices[source + 3];
        splatData[offset++] = part.cr;
        splatData[offset++] = part.cg;
        splatData[offset++] = part.cb;
      }
    }

    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
    gl.viewport(0, 0, fieldWidth, fieldHeight);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(splatProgram);
    gl.uniform2f(splatResolution, fieldWidth, fieldHeight);
    gl.uniform1f(splatGain, gain);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE);
    gl.bindBuffer(gl.ARRAY_BUFFER, splatBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, splatData.subarray(0, offset), gl.DYNAMIC_DRAW);
    gl.enableVertexAttribArray(positionLocation);
    gl.enableVertexAttribArray(localLocation);
    gl.enableVertexAttribArray(colorLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 28, 0);
    gl.vertexAttribPointer(localLocation, 2, gl.FLOAT, false, 28, 8);
    gl.vertexAttribPointer(colorLocation, 3, gl.FLOAT, false, 28, 16);
    gl.drawArrays(gl.TRIANGLES, 0, offset / 7);
    gl.disableVertexAttribArray(localLocation);
    gl.disableVertexAttribArray(colorLocation);

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(inkProgram);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, framebufferTexture);
    gl.uniform1i(inkTexture, 0);
    gl.uniform1f(inkThreshold, FIELD_THRESHOLD * gain);
    gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
    gl.enableVertexAttribArray(clipLocation);
    gl.vertexAttribPointer(clipLocation, 2, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  function stop() {
    if (!frameRequest) return;
    cancelAnimationFrame(frameRequest);
    frameRequest = 0;
  }

  function stillFrame() {
    if (!resize()) return;
    render();
  }

  function frame(now: number) {
    frameRequest = requestAnimationFrame(frame);
    if (!visible || !resize()) return;

    const delta = Math.min((now - lastFrame) / 1000, 0.05);
    lastFrame = now;
    const time = (now - startTime) / 1000;
    pointerX = damp(pointerX, targetX, 0.08, delta);
    pointerY = damp(pointerY, targetY, 0.08, delta);
    pointerEnergy *= Math.exp(-delta / TAU_ENERGY);
    pointerDirectionX *= Math.exp(-delta / 0.16);
    pointerDirectionY *= Math.exp(-delta / 0.16);

    simulate(time, delta);
    render();
  }

  function start() {
    if (reducedMotion.matches) {
      stop();
      requestAnimationFrame(stillFrame);
    } else if (!frameRequest) {
      lastFrame = performance.now();
      frameRequest = requestAnimationFrame(frame);
    }
  }

  window.addEventListener(
    'pointermove',
    (event) => {
      const rect = canvas.getBoundingClientRect();
      if (rect.height <= 0) return;
      const nextX = event.clientX - rect.left;
      const nextY = event.clientY - rect.top;
      if (!hasPointer) {
        pointerX = nextX;
        pointerY = nextY;
        pointerDirectionX = 0;
        pointerDirectionY = 0;
      } else {
        pointerDirectionX = nextX - targetX;
        pointerDirectionY = nextY - targetY;
      }
      targetX = nextX;
      targetY = nextY;
      hasPointer = true;
      pointerEnergy = Math.min(1, pointerEnergy + 0.38);
    },
    { passive: true },
  );

  window.addEventListener(
    'resize',
    () => {
      if (reducedMotion.matches) requestAnimationFrame(stillFrame);
    },
    { passive: true },
  );

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stop();
    else start();
  });

  gl.canvas.addEventListener('webglcontextlost', (event) => {
    event.preventDefault();
    stop();
  });

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
      },
      { threshold: 0 },
    ).observe(canvas);
  }

  reducedMotion.addEventListener('change', start);
  resize();
  start();
}
