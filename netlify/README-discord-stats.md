# Automated Discord Member Count

The Discord member count next to "Join Discord Server" updates automatically when you deploy this site to **Netlify**.

## How it works

- **Netlify Function** (`netlify/functions/discord-stats.js`) runs on Netlify’s servers and calls Discord’s invite API (no CORS). It uses Node’s built-in `https` module so it works on any Node version.
- The function returns `approximate_member_count` and `approximate_presence_count`. Results are cached for 5 minutes. CORS headers are set so the browser can read the response.
- The frontend fetches `/.netlify/functions/discord-stats` and updates the number (and “X online” when available).
- **Invite must be valid:** Discord only returns counts for a valid, non-expired invite. In Server Settings → Invite People, create a link that doesn’t expire and use that code.

## Deploying on Netlify

1. Push this repo to GitHub (or connect the folder to Netlify).
2. In Netlify: **New site from Git** → choose the repo → deploy.
3. No extra config needed. The function is picked up from `netlify/functions/`.

## Changing the Discord invite

The function uses invite code `2JqtG8Xj4h` (from your current Discord link). To use a different server:

- **Option A:** In Netlify: **Site settings → Environment variables** → add `DISCORD_INVITE_CODE` = your invite code (e.g. `AbCdEfGh` from `discord.gg/AbCdEfGh`).
- **Option B:** Edit `netlify/functions/discord-stats.js` and change the default `DISCORD_INVITE_CODE` value.

## Local / other hosts

- **Locally** or on hosts **without** Netlify Functions, the fetch to `/.netlify/functions/discord-stats` will fail; the page will keep showing “—” for the count. Everything else still works.
- To get the live count, deploy to Netlify (or add a similar serverless function on Vercel/Cloudflare and point the script at that URL).
