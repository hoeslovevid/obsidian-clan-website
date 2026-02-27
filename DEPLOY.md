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

(Or your custom domain if you set one—see below.)

---

## Custom domain (e.g. Squarespace, Namecheap, etc.)

To use a domain you bought (e.g. from Squarespace) with GitHub Pages:

### 1. Add the domain in GitHub

1. Repo → **Settings** → **Pages**.
2. Under **Custom domain**, enter your domain: `yourdomain.com` (apex) or `www.yourdomain.com` (www).
3. Click **Save**. If GitHub shows a DNS warning, continue to the next step.

### 2. Point DNS at GitHub (at your registrar)

Log in where you manage DNS (Squarespace: **Settings** → **Domains** → your domain → **DNS Settings**). Add one of these:

**Option A – Use www (e.g. www.yourdomain.com)**  
- **Type:** CNAME  
- **Host:** `www` (or `www.yourdomain.com` if your host requires the full name)  
- **Value / Points to:** `YOUR_USERNAME.github.io`  
- Save.

**Option B – Use apex/root (e.g. yourdomain.com)**  
- Add **four A records** (one per line if your host asks for one record per IP):  
  - **Host:** `@` (or leave blank for root)  
  - **Value:**  
    - `185.199.108.153`  
    - `185.199.109.153`  
    - `185.199.110.153`  
    - `185.199.111.153`  

**Option C – Both www and apex**  
- Do Option A for `www` and Option B for `@`. In GitHub you can only set one custom domain per site; choose either `www` or apex. To support both, set the primary in GitHub and add a **redirect** at your registrar (e.g. redirect `yourdomain.com` → `www.yourdomain.com`).

Replace `YOUR_USERNAME` with your GitHub username (e.g. `hoeslovevid`).

### 3. Enforce HTTPS (after DNS works)

After DNS has propagated (minutes to a few hours), GitHub will issue a certificate. In **Settings** → **Pages**, check **Enforce HTTPS** so the site is always served over HTTPS.

### 4. Squarespace-specific

- Use **Settings** → **Domains** → [your domain] → **DNS** (or **Advanced** / **Use custom nameservers** if you use external DNS).
- **Disconnect the domain from any Squarespace site** (e.g. remove “Squarespace Domain connect” or “Connected site”). If the domain is connected to a Squarespace website, Squarespace controls where it points and your A/CNAME records for GitHub won’t work. The domain can stay registered with Squarespace; you’re only stopping it from being the URL for a Squarespace site. Then add the A and CNAME records above.

### 5. Troubleshooting: "Domain's DNS record could not be retrieved"

GitHub shows this when it can’t see your DNS yet. Do the following:

1. **Add the records in Squarespace first**  
   **Settings** → **Domains** → [your domain] → **DNS** → **Add record**.  
   - For **www**: Type **CNAME**, Host/Name **www**, Value **YOUR_USERNAME.github.io** (e.g. `hoeslovevid.github.io`). No `https://`, no trailing slash.  
   - For **apex** (no www): Add **four A records**. For each: Type **A**, Host/Name **@** (or leave blank for root), Value one of: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`.

2. **Remove conflicting records**  
   If the domain was pointing to Squarespace, delete any existing A or CNAME records that point to Squarespace for the same host (e.g. `@` or `www`), or they will override the GitHub records.

3. **Match what you set in GitHub**  
   In **Settings** → **Pages** → **Custom domain**, you must enter exactly what you configured: either `www.yourdomain.com` or `yourdomain.com`, not both. Use the one you added the record for.

4. **Wait and retry**  
   DNS can take 5–30 minutes or longer. After saving in Squarespace, wait 10–15 minutes, then in GitHub: clear the custom domain field and click **Save**, then type the domain again and **Save** to re-run the check.

5. **Check from your machine**  
   In a terminal: `nslookup www.yourdomain.com` (or `yourdomain.com`). You should see the GitHub IPs or `username.github.io` for CNAME. If not, the records aren’t live yet or are wrong at Squarespace.

6. **“Both the domain and its alternate are improperly configured”**  
   GitHub checks **both** the apex (`theobsidianoathlegion.com`) and **www** (`www.theobsidianoathlegion.com`). You must add DNS for **both** in Squarespace:
   - **Apex:** Add **four A records**. Host **@**, values: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`.
   - **www:** Add **one CNAME**. Host **www**, value **hoeslovevid.github.io** (no `https://`, no slash).
   Remove any other A or CNAME for `@` or `www` that point to Squarespace. In GitHub’s Custom domain field use either `theobsidianoathlegion.com` or `www.theobsidianoathlegion.com` (your preference). Save, wait 10–15 min, then **Check again**.

7. **nslookup shows the right IPs but GitHub still fails**  
   GitHub’s check can use different DNS servers or cache. Try:  
   - **Force a fresh check:** In GitHub, remove the custom domain completely (clear the field → Save). Wait **5–10 minutes**, then type the domain again and Save. Click **Check again**.  
   - **Verify what the rest of the world sees:** Run `nslookup theobsidianoathlegion.com 8.8.8.8` and `nslookup www.theobsidianoathlegion.com 8.8.8.8` (8.8.8.8 = Google DNS). You should see the four GitHub IPs for apex and, for www, either those same IPs or a CNAME to `hoeslovevid.github.io`.  
   - **www CNAME must be exact:** Host **www**, value **hoeslovevid.github.io** only (no `https://`, no path, no trailing dot).  
   - **All four A records:** Apex must have four A records (one per IP). If any are missing or wrong, GitHub may fail.  
   - If it still fails after 24–48 hours, wait for full global propagation and retry, or contact GitHub support.

---

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
