// Port of Avarta's share-id codec (../../Avarta: crates/avarta-core/src/params.rs
// `encode_id` + idcodec.rs base64url). It turns a parameter set into the
// `#s=<id>` hash the Avarta web viewer reads, so a blog link can open the exact
// shell shown in the article. Verified to reproduce the reference id for the
// default shell (`AQAAFZeZIA`).

const TAU = Math.PI * 2;

// [key, min, max, step, default] — mirrors PARAM_RANGES + PIGMENT_RANGES in
// avarta-core/src/params.rs. The order defines the presence-bitmap order and
// MUST match the Rust tables exactly.
const RANGES: [string, number, number, number, number][] = [
  ['w', 1.05, 8.0, 0.01, 2.0],
  ['d', 0.0, 0.95, 0.01, 0.15],
  ['t', 0.0, 12.0, 0.05, 1.5],
  ['n', 0.5, 20.0, 0.1, 5.0],
  ['aspect', 0.3, 4.0, 0.02, 1.0],
  ['rib_ax_count', 0, 40, 1, 0],
  ['rib_ax_amp', 0, 0.6, 0.02, 0],
  ['rib_sp_count', 0, 60, 1, 0],
  ['rib_sp_amp', 0, 0.6, 0.02, 0],
  ['rib_sharp', 0, 1, 0.02, 0],
  ['proj_count', 0, 30, 1, 0],
  ['proj_rows', 0, 5, 1, 0],
  ['proj_pos', 0, TAU, 0.05, 0],
  ['proj_size', 0, 1.2, 0.02, 0],
  ['proj_sharp', 0, 1, 0.02, 0],
  ['varix_count', 0, 6, 1, 0],
  ['varix_amp', 0, 0.5, 0.02, 0],
  ['seed', 0, 255, 1, 0],
  ['jitter', 0, 1, 0.02, 0],
  ['pig_regime', 0, 6, 1, 0],
  ['pig_scale', 0, 1, 0.02, 0.5],
  ['pig_contrast', 0, 1, 0.02, 0.5],
  ['pig_density', 0, 1, 0.02, 0.5],
  ['pig_angle', 0, 1, 0.02, 0],
  ['pig_irregularity', 0, 1, 0.02, 0],
];

// Pigment baked into the demo link so the full viewer renders a pleasant banded
// shell rather than a flat solid one. At default geometry these values make the
// encoder reproduce the canonical reference id exactly.
const DEMO_PIGMENT: Record<string, number> = {
  pig_regime: 1,
  pig_contrast: 0.6,
  pig_angle: 0.5,
  pig_irregularity: 0.16,
};

// `.AQA` is Avarta's default "look" segment (material + palette). The viewer
// treats the look as optional, so this just pins the canonical default.
const AVARTA_URL = 'https://codetiger.in/avarta/#s=';
const DEFAULT_LOOK = 'AQA';

const B64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';

function base64url(bytes: number[]): string {
  let out = '';
  for (let i = 0; i < bytes.length; i += 3) {
    const b0 = bytes[i];
    const b1 = i + 1 < bytes.length ? bytes[i + 1] : 0;
    const b2 = i + 2 < bytes.length ? bytes[i + 2] : 0;
    const n = (b0 << 16) | (b1 << 8) | b2;
    out += B64[(n >> 18) & 63] + B64[(n >> 12) & 63];
    if (i + 1 < bytes.length) out += B64[(n >> 6) & 63];
    if (i + 2 < bytes.length) out += B64[n & 63];
  }
  return out;
}

const levelsOf = (min: number, max: number, step: number) => Math.round((max - min) / step) + 1;
const levelBits = (levels: number) => {
  let b = 0;
  while (1 << b < levels) b++;
  return b;
};
const quantize = (v: number, min: number, step: number, levels: number) =>
  Math.min(Math.max(Math.round((v - min) / step), 0), levels - 1);

/** Encode a parameter set into Avarta's compact share id (version byte +
 * presence bitmap + packed step-indices, MSB-first, base64url). Mirrors
 * `encode_id` in avarta-core. */
export function encodeShellId(params: Record<string, number>): string {
  const bytes: number[] = [];
  let cur = 0;
  let nb = 0;
  const write = (val: number, w: number) => {
    for (let i = w - 1; i >= 0; i--) {
      cur = (cur << 1) | ((val >>> i) & 1);
      if (++nb === 8) {
        bytes.push(cur);
        cur = 0;
        nb = 0;
      }
    }
  };
  write(1, 8); // ID_VERSION
  // Pass 1: presence bitmap (1 = differs from default), collect present indices.
  const present: [number, number][] = [];
  for (const [key, min, max, step, def] of RANGES) {
    const levels = levelsOf(min, max, step);
    const v = key in params ? params[key] : def;
    const idx = quantize(v, min, step, levels);
    const differs = idx !== quantize(def, min, step, levels);
    write(differs ? 1 : 0, 1);
    if (differs) present.push([idx, levelBits(levels)]);
  }
  // Pass 2: the step-index of each present param, in table order.
  for (const [idx, lb] of present) write(idx, lb);
  if (nb > 0) bytes.push(cur << (8 - nb)); // pad final byte to a boundary
  return base64url(bytes);
}

// --- Layer-4 "look" segment (material finish + palette) ---------------------
// Avarta encodes the look viewer-side, separately from the mesh id: a version
// byte, a presence-mask byte (bits 0..3 = the 4 material sliders, bits 4..6 =
// the 3 palette colours), then the changed material step-indices and changed
// colours as RGB565. Default look encodes to "AQA". Mirrors index.html.
const LOOK_VERSION = 1;
const MAT_LOOK: [string, number, number, number, number][] = [
  ['roughness', 0, 1, 0.01, 0.3],
  ['clearcoat', 0, 1, 0.01, 0.55],
  ['transmission', 0, 1, 0.01, 0.0],
  ['iridescence', 0, 1, 0.01, 0.0],
];
const PAL_LOOK: [string, string][] = [
  ['base', '#efe3c8'],
  ['accent', '#b9793f'],
  ['pattern', '#6f3d1d'],
];
const matIndex = (v: number, min: number, max: number, step: number) =>
  Math.min(Math.max(Math.round((v - min) / step), 0), Math.round((max - min) / step));
const toRGB565 = (hex: string) => {
  const n = parseInt(hex.replace('#', ''), 16);
  return (((n >> 16) & 255) >> 3 << 11) | (((n >> 8) & 255) >> 2 << 5) | ((n & 255) >> 3);
};

/** Optional Layer-4 look: material finish + 3-stop palette (hex colours). */
export interface ShellLook {
  roughness?: number; clearcoat?: number; transmission?: number; iridescence?: number;
  base?: string; accent?: string; pattern?: string;
}

function encodeLook(look: ShellLook): string {
  let mask = 0;
  const body: number[] = [];
  MAT_LOOK.forEach(([key, min, max, step, def], i) => {
    const v = (look as Record<string, number>)[key] ?? def;
    const idx = matIndex(v, min, max, step);
    if (idx !== matIndex(def, min, max, step)) { mask |= 1 << i; body.push(idx); }
  });
  PAL_LOOK.forEach(([key, def], i) => {
    const cur = toRGB565(((look as Record<string, string>)[key] || def));
    if (cur !== toRGB565(def)) { mask |= 1 << (4 + i); body.push((cur >> 8) & 255, cur & 255); }
  });
  return base64url([LOOK_VERSION, mask, ...body]);
}

/** Full Avarta viewer URL for a parameter set. When the caller supplies no
 * pigment of its own (the Layer-1/2 viewers), a pleasant demo pigment is baked
 * in so the shared shell still looks good; when it does, the caller's pigment is
 * encoded verbatim. An optional `look` bakes material finish + palette colours
 * into the shareable URL (otherwise the default look is used). */
export function encodeShellUrl(params: Record<string, number>, look?: ShellLook): string {
  const merged = 'pig_regime' in params ? params : { ...params, ...DEMO_PIGMENT };
  const lookSeg = look ? encodeLook(look) : DEFAULT_LOOK;
  return AVARTA_URL + encodeShellId(merged) + '.' + lookSeg;
}
