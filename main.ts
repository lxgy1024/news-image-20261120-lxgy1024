// news-image-20261120: copy the front-page image for Friday 20 November 2026
// to the output directory. The image is drawn offline by draw.py (PIL) and
// stored in this repo as entry.png; this program only validates it and
// writes it out, so two runs produce byte-identical output.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const PNG_MAGIC = "89504e470d0a1a0a";
const MAX_BYTES = 1048576; // 1 MiB

const here = dirname(fileURLToPath(import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const target = join(outDir, "entry.png");

const pngPath = join(here, "entry.png");
if (!existsSync(pngPath)) {
  throw new Error("entry.png is missing from the repository checkout");
}
const bytes = readFileSync(pngPath);
if (bytes.length > MAX_BYTES) {
  throw new Error(
    `entry image is ${bytes.length} bytes, over the 1 MiB cap`,
  );
}
if (bytes.subarray(0, 8).toString("hex") !== PNG_MAGIC) {
  throw new Error("entry image is not a PNG file");
}

mkdirSync(outDir, { recursive: true });
writeFileSync(target, bytes);
console.log(`wrote ${bytes.length} bytes to ${target}`);
