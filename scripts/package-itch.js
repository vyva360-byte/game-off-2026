/**
 * itch.io Packaging Pipeline
 * Copies production files and generates ready-to-upload dist/game-off-2026.zip
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SRC_DIR = path.resolve(__dirname, '../src');
const DIST_DIR = path.resolve(__dirname, '../dist');
const STAGING_DIR = path.join(DIST_DIR, 'game-off-2026');
const ZIP_OUTPUT = path.join(DIST_DIR, 'game-off-2026.zip');

console.log('\n[PACKAGE] Building itch.io release distribution...');

// Ensure clean dist directory
if (fs.existsSync(DIST_DIR)) {
  fs.rmSync(DIST_DIR, { recursive: true, force: true });
}
fs.mkdirSync(STAGING_DIR, { recursive: true });

// Recursive copy function
function copyRecursive(src, dest) {
  const stats = fs.statSync(src);
  if (stats.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });
    for (const child of fs.readdirSync(src)) {
      copyRecursive(path.join(src, child), path.join(dest, child));
    }
  } else {
    fs.copyFileSync(src, dest);
  }
}

copyRecursive(SRC_DIR, STAGING_DIR);
console.log(`[PACKAGE] Staged files in: ${STAGING_DIR}`);

// Verify index.html exists at root of staging
if (!fs.existsSync(path.join(STAGING_DIR, 'index.html'))) {
  console.error('[PACKAGE ERROR] Missing index.html at root of staging directory!');
  process.exit(1);
}

// Compress to ZIP using PowerShell Compress-Archive
try {
  const psCommand = `powershell.exe -NoProfile -Command "Compress-Archive -Path '${STAGING_DIR}\\*' -DestinationPath '${ZIP_OUTPUT}' -Force"`;
  execSync(psCommand, { stdio: 'inherit' });
  console.log(`\n======================================================`);
  console.log(`✓ itch.io Package Successfully Generated!`);
  console.log(`📦 Archive: ${ZIP_OUTPUT}`);
  console.log(`📏 Size: ${(fs.statSync(ZIP_OUTPUT).size / 1024).toFixed(2)} KB`);
  console.log(`======================================================\n`);
} catch (err) {
  console.error('[PACKAGE ERROR] Failed to compress archive:', err);
  process.exit(1);
}
