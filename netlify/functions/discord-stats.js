/**
 * Netlify serverless function: fetches Discord invite stats (member count).
 * Called by the frontend to show live member count. Cached 5 min to avoid rate limits.
 *
 * Set DISCORD_INVITE_CODE in Netlify env if your invite code differs (e.g. from discord.gg/XXXXX).
 */

const https = require('https');

const DISCORD_INVITE_CODE = process.env.DISCORD_INVITE_CODE || '2JqtG8Xj4h';
const CACHE_MAX_AGE = 300; // 5 minutes

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json',
};

function jsonResponse(statusCode, body, extraHeaders = {}) {
  return {
    statusCode,
    headers: { ...corsHeaders, ...extraHeaders },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  };
}

function fetchDiscordInvite() {
  return new Promise((resolve, reject) => {
    const url = `https://discord.com/api/v10/invites/${encodeURIComponent(DISCORD_INVITE_CODE)}?with_counts=true`;
    const req = https.get(url, { headers: { Accept: 'application/json' } }, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const parsed = data ? JSON.parse(data) : {};
          resolve({ ok: res.statusCode >= 200 && res.statusCode < 300, statusCode: res.statusCode, data: parsed });
        } catch (e) {
          reject(e);
        }
      });
    });
    req.on('error', reject);
    req.setTimeout(8000, () => { req.destroy(); reject(new Error('timeout')); });
  });
}

exports.handler = async function (event) {
  if (event && event.httpMethod === 'OPTIONS') {
    return jsonResponse(204, '');
  }

  try {
    const { ok, statusCode, data } = await fetchDiscordInvite();

    if (!ok) {
      return jsonResponse(statusCode || 502, { error: 'Discord API error', count: null, online: null });
    }

    const count = data.approximate_member_count != null ? data.approximate_member_count : null;
    const online = data.approximate_presence_count != null ? data.approximate_presence_count : null;

    return jsonResponse(200, { count, online }, {
      'Cache-Control': `public, max-age=${CACHE_MAX_AGE}`,
    });
  } catch (err) {
    return jsonResponse(500, { error: 'Failed to fetch Discord stats', count: null, online: null });
  }
};
