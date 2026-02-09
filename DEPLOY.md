# Deploy with GitHub + Netlify

This guide sets up automatic deploys: push to GitHub → Netlify builds and deploys.

## 1. Create a GitHub repo

1. Go to [github.com/new](https://github.com/new).
2. Name the repo (e.g. `obsidian-oath-legion`).
3. Leave it empty (no README, .gitignore, or license).
4. Create the repo.

## 2. Push this project to GitHub

In a terminal, from this project folder:

```bash
git init
git add .
git commit -m "Initial commit: Obsidian Oath Legion site"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

Replace `YOUR_USERNAME` and `YOUR_REPO_NAME` with your GitHub username and repo name.

## 3. Connect the repo to Netlify

1. Log in at [app.netlify.com](https://app.netlify.com).
2. Click **Add new site** → **Import an existing project**.
3. Choose **GitHub** and authorize Netlify if asked.
4. Select the repo you just pushed.
5. Netlify will prefill from `netlify.toml`:
   - **Build command:** `npm run build`
   - **Publish directory:** `.`
   - **Functions directory:** `netlify/functions`
6. Before deploying, add the admin password:
   - Open **Site settings** → **Environment variables** → **Add a variable** (or **Add env vars** in the deploy step).
   - Key: `ADMIN_EDIT_PASSWORD`
   - Value: the password you want for the “Edit admins” panel.
   - Save.
7. Click **Deploy site**.

The build will run `npm run build`, which generates `data/admin-config.js` from `ADMIN_EDIT_PASSWORD`, so the password is never stored in GitHub.

## 4. After the first deploy

- Your site will be at a URL like `https://something.netlify.app`.
- To use your own domain: **Domain settings** → **Add custom domain**.
- **Edit admins:** open the site, click “Edit admins” in the footer, and sign in with the password you set in Netlify.

## 5. Automatic deploys

Whenever you push to `main` (or the branch you connected), Netlify will run the build and deploy the new version. No extra steps.

---

## Troubleshooting: Admin password doesn't work

1. **Set the env var in Netlify**  
   Site configuration → Environment variables. Add **Key:** `ADMIN_EDIT_PASSWORD` (exact spelling). **Value:** your password (no extra spaces).

2. **Redeploy**  
   Changing the variable doesn’t affect an already-built site. Go to **Deploys** → **Trigger deploy** → **Deploy site**.

3. **Check the build log**  
   Deploys → latest deploy → Build log. You should see `Wrote data/admin-config.js (password length: X)`. If you see `ERROR: ADMIN_EDIT_PASSWORD is not set`, add the variable and trigger a new deploy.

4. **Cache**  
   Try in an incognito window or hard refresh (Ctrl+F5).

---

**Local development:** To run the build locally so “Edit admins” works, create `data/admin-config.js` yourself (see `data/admin-config.example.js`) or run:

```bash
set ADMIN_EDIT_PASSWORD=yourpassword
npm run build
```

On Mac/Linux use `export ADMIN_EDIT_PASSWORD=yourpassword` before `npm run build`.
