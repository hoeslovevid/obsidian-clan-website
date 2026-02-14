/**
 * Generates data/admin-config.js from the ADMIN_EDIT_PASSWORD env var.
 * Used by GitHub Actions so the password is set as a repo secret, not in the repo.
 * Run locally (Windows): set ADMIN_EDIT_PASSWORD=yourpass && node scripts/generate-admin-config.js
 * Run locally (Mac/Linux): ADMIN_EDIT_PASSWORD=yourpass node scripts/generate-admin-config.js
 */
const fs = require('fs');
const path = require('path');

const password = process.env.ADMIN_EDIT_PASSWORD;
if (password === undefined || password === '') {
  console.error('');
  console.error('ERROR: ADMIN_EDIT_PASSWORD is not set.');
  console.error('  - In GitHub: Settings → Secrets and variables → Actions → Add ADMIN_EDIT_PASSWORD');
  console.error('  - Then run the "Deploy to GitHub Pages" workflow (or push to main).');
  console.error('  - Locally: set ADMIN_EDIT_PASSWORD=yourpass (Windows) or export ADMIN_EDIT_PASSWORD=yourpass (Mac/Linux)');
  console.error('');
  process.exit(1);
}

const outDir = path.join(__dirname, '..', 'data');
const outPath = path.join(outDir, 'admin-config.js');

const content =
  '/**\n' +
  ' * Admin editor access (generated at build time).\n' +
  ' */\n' +
  'var ADMIN_EDIT_PASSWORD = ' + JSON.stringify(String(password).trim()) + ';\n';

if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(outPath, content, 'utf8');
console.log('Wrote data/admin-config.js (password length: ' + String(password).trim().length + ')');
