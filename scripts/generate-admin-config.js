/**
 * Generates data/admin-config.js from the ADMIN_EDIT_PASSWORD env var.
 * Used by Netlify build so the password is set in the Netlify UI, not in the repo.
 * Run locally: ADMIN_EDIT_PASSWORD=yourpass node scripts/generate-admin-config.js
 */
const fs = require('fs');
const path = require('path');

const password = process.env.ADMIN_EDIT_PASSWORD || '';
const outDir = path.join(__dirname, '..', 'data');
const outPath = path.join(outDir, 'admin-config.js');

const content =
  '/**\n' +
  ' * Admin editor access (generated at build time).\n' +
  ' * Password is set via Netlify env var ADMIN_EDIT_PASSWORD.\n' +
  ' */\n' +
  'var ADMIN_EDIT_PASSWORD = ' + JSON.stringify(password) + ';\n';

if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(outPath, content, 'utf8');
console.log('Wrote data/admin-config.js');
