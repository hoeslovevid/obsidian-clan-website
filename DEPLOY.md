# Deploy with GitHub Pages

This guide sets up automatic deploys: push to `main` → GitHub Actions builds (with your admin password from a secret) and deploys to GitHub Pages.

## 1. Create a GitHub repo (if needed)

1. Go to [github.com/new](https://github.com/new).
2. Name the repo (e.g. `obsidian-oath-legion`).
3. Create the repo (with or without a README).

## 2. Push this project to GitHub

From this project folder:

```bash
git add .
git commit -m "Initial commit: Obsidian Oath Legion site"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

Replace `YOUR_USERNAME` and `YOUR_REPO_NAME` with your GitHub username and repo name.

## 3. Add the admin password as a secret

The “Edit admins” panel is protected by a password. The site is built in GitHub Actions using that password; it is **never** stored in the repo.

1. In your repo, go to **Settings** → **Secrets and variables** → **Actions**.
2. Click **New repository secret**.
3. **Name:** `ADMIN_EDIT_PASSWORD`
4. **Value:** the password you want for the “Edit admins” panel.
5. Click **Add secret**.

## 4. Enable GitHub Pages (Actions)

1. In the repo, go to **Settings** → **Pages**.
2. Under **Build and deployment**, set **Source** to **GitHub Actions**.
3. Save (no need to pick a branch when using Actions).

## 5. Run the deploy

- **Automatic:** Every push to `main` runs the workflow: it builds (generating `data/admin-config.js` from `ADMIN_EDIT_PASSWORD`) and deploys to GitHub Pages.
- **Manual:** **Actions** → **Deploy to GitHub Pages** → **Run workflow**.

After the workflow finishes, your site will be at:

`https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/`

(Or your custom domain if you set one under **Settings** → **Pages**.)

## 6. Edit admins

- Open the site, click **“Edit admins”** in the footer (or go to `#edit-admins`).
- Enter the password you set in **ADMIN_EDIT_PASSWORD**.
- Edit the list, then use **“Export admins.js”** to download `admins.js`. Commit and push the new `data/admins.js` to update the live list.

---

## Troubleshooting: Admin password doesn’t work

1. **Use GitHub Actions as the Pages source**  
   If you see “Admin access is not configured” on the live site, **Settings** → **Pages** → **Build and deployment** → **Source** must be **GitHub Actions**, not “Deploy from a branch”. Branch deploys serve the repo as-is, and `admin-config.js` is gitignored so it never appears. Only the workflow build produces that file and deploys it.

2. **Add the secret**  
   **Settings** → **Secrets and variables** → **Actions**. Add **Name:** `ADMIN_EDIT_PASSWORD` (exact spelling). **Value:** your password (no extra spaces).

3. **Redeploy**  
   **Actions** → **Deploy to GitHub Pages** → **Run workflow**. The password is only injected at build time.

4. **Check the workflow log**  
   Open the latest run → **build-and-deploy** job. The build step should log: `Wrote data/admin-config.js (password length: X)`. If you see `ERROR: ADMIN_EDIT_PASSWORD is not set`, add the secret and run the workflow again.

5. **Cache**  
   Try an incognito window or hard refresh (Ctrl+F5).

---

## Local development

To run the build locally so “Edit admins” works:

**Windows (PowerShell):**
```powershell
$env:ADMIN_EDIT_PASSWORD = "yourpassword"
npm run build
```

**Windows (CMD):**
```cmd
set ADMIN_EDIT_PASSWORD=yourpassword
npm run build
```

**Mac/Linux:**
```bash
export ADMIN_EDIT_PASSWORD=yourpassword
npm run build
```

Or create `data/admin-config.js` yourself (see `data/admin-config.example.js`). That file is gitignored so your password is not committed.
