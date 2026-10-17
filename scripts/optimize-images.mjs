/**
 * Compress / resize raster images under public/ in place.
 * Keeps original filenames so blog/service paths stay valid.
 */
import fs from "fs";
import path from "path";
import sharp from "sharp";

const ROOT = path.resolve("public");
const MAX_WIDTH = 1600;
const JPEG_QUALITY = 78;
const PNG_QUALITY = 80;
const MIN_BYTES_TO_TOUCH = 80 * 1024; // skip tiny assets like logo if already small enough after check

const EXT = new Set([".jpg", ".jpeg", ".png", ".webp"]);

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (EXT.has(path.extname(entry.name).toLowerCase())) out.push(full);
  }
  return out;
}

async function optimizeFile(file) {
  const before = fs.statSync(file).size;
  if (before < MIN_BYTES_TO_TOUCH) {
    return { file, before, after: before, skipped: "small" };
  }

  const ext = path.extname(file).toLowerCase();
  const input = fs.readFileSync(file);
  let pipeline = sharp(input, { failOn: "none" }).rotate();
  const meta = await sharp(input, { failOn: "none" }).metadata();

  if (meta.width && meta.width > MAX_WIDTH) {
    pipeline = pipeline.resize({
      width: MAX_WIDTH,
      withoutEnlargement: true,
    });
  }

  let buffer;
  if (ext === ".png") {
    // Prefer JPEG for photo-like PNGs when opaque; otherwise compress PNG
    const hasAlpha = meta.hasAlpha;
    if (!hasAlpha && before > 300 * 1024) {
      // Convert heavy opaque PNG photos to JPEG sibling? Keep PNG path — recompress as PNG.
      buffer = await pipeline.png({ quality: PNG_QUALITY, compressionLevel: 9 }).toBuffer();
    } else {
      buffer = await pipeline.png({ quality: PNG_QUALITY, compressionLevel: 9 }).toBuffer();
    }
  } else if (ext === ".webp") {
    buffer = await pipeline.webp({ quality: JPEG_QUALITY }).toBuffer();
  } else {
    buffer = await pipeline.jpeg({ quality: JPEG_QUALITY, mozjpeg: true }).toBuffer();
  }

  // Only write if we actually shrink (or dimension fix with near-same size)
  if (buffer.length >= before * 0.98 && !(meta.width > MAX_WIDTH)) {
    return { file, before, after: before, skipped: "no-gain" };
  }

  fs.writeFileSync(file, buffer);
  return { file, before, after: buffer.length, skipped: null };
}

const files = walk(ROOT);
const results = [];
for (const file of files) {
  try {
    results.push(await optimizeFile(file));
  } catch (err) {
    results.push({ file, error: err.message });
  }
}

let saved = 0;
let beforeTotal = 0;
let afterTotal = 0;
for (const r of results) {
  const rel = path.relative(process.cwd(), r.file);
  if (r.error) {
    console.log(`ERROR  ${rel}: ${r.error}`);
    continue;
  }
  beforeTotal += r.before;
  afterTotal += r.after ?? r.before;
  if (r.skipped) {
    console.log(`skip   ${rel} (${r.skipped}, ${(r.before / 1024).toFixed(0)} KB)`);
  } else {
    const delta = r.before - r.after;
    saved += delta;
    console.log(
      `ok     ${rel}: ${(r.before / 1024).toFixed(0)} KB → ${(r.after / 1024).toFixed(0)} KB (−${(delta / 1024).toFixed(0)} KB)`
    );
  }
}

console.log(
  `\nDone. ${results.filter((r) => !r.skipped && !r.error).length} optimized. Saved ${(saved / 1024 / 1024).toFixed(2)} MB total (${(beforeTotal / 1024 / 1024).toFixed(2)} → ${(afterTotal / 1024 / 1024).toFixed(2)} MB).`
);
