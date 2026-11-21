import fs from 'fs';
import path from 'path';

const src = path.resolve('client/dist');
const dest = path.resolve('dist');

if (fs.existsSync(src)) {
  fs.cpSync(src, dest, { recursive: true, force: true });
  console.log(`[Vercel Build] Successfully copied client/dist to root dist/ (${fs.readdirSync(dest).length} items)`);
} else {
  console.error(`[Vercel Build Error] Source directory ${src} not found!`);
  process.exit(1);
}
