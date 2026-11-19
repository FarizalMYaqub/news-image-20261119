// news-image-20261119 — a one-image entry (Node 22, standard library only).
// The image, entry.png beside this file, sums up the world news of
// Thursday 19 November 2026 as a newspaper front page. This program
// copies it to the output directory the grader provides.
//
// Run locally with:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
mkdirSync(outDir, { recursive: true });
const src = join(here, 'entry.png');
const dest = join(outDir, 'entry.png');
copyFileSync(src, dest);

// The grader runs this program twice and both runs must write the same
// bytes; the copy is byte-identical by construction, but fail loudly if
// the source image ever goes missing instead of writing a partial file.
// A second guard: the output must be a whole PNG — check the 8-byte
// signature and the trailing IEND chunk so a truncated write is caught.
const { size } = statSync(dest);
const { size: srcSize } = statSync(src);
if (size === 0 || size > 1048576 || size !== srcSize) {
  throw new Error(`entry.png has unexpected size ${size} (source ${srcSize})`);
}
const bytes = readFileSync(dest);
const PNG_SIG = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
if (!bytes.subarray(0, 8).equals(PNG_SIG) || !bytes.subarray(-12).equals(Buffer.concat([Buffer.from([0, 0, 0, 0]), Buffer.from('IEND'), Buffer.from([0xae, 0x42, 0x60, 0x82])]))) {
  throw new Error('entry.png is not a whole PNG (bad signature or missing IEND)');
}
