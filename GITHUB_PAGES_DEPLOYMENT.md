# 🚀 GitHub Pages Deployment Guide

## ✅ Configuration Complete!

I've set up your project for GitHub Pages deployment. Here's what I've configured:

### Files Updated:
1. ✅ **package.json** - Added `predeploy` and `deploy` scripts
2. ✅ **next.config.js** - Configured for static export
3. ✅ **gh-pages** - Installed deployment package

---

## 📋 Step-by-Step Deployment Instructions

### Step 1: Initialize Git Repository

```powershell
# Initialize git
git init

# Add all files
git add .

# Create first commit
git commit -m "Initial commit - Copilot Adoption Navigator"
```

---

### Step 2: Create GitHub Repository

**Option A: Using GitHub CLI (if installed)**
```powershell
# Login to GitHub
gh auth login

# Create repository
gh repo create copilot-adoption-navigator --public --source=. --remote=origin --push
```

**Option B: Using GitHub Website (Manual)**
1. Go to https://github.com/new
2. Repository name: `copilot-adoption-navigator`
3. Choose: **Public** (or Private if you prefer)
4. **Do NOT** initialize with README, .gitignore, or license
5. Click "Create repository"

6. Then run these commands:
```powershell
git remote add origin https://github.com/YOUR-USERNAME/copilot-adoption-navigator.git
git branch -M main
git push -u origin main
```

---

### Step 3: Deploy to GitHub Pages

```powershell
# This will build and deploy your app
npm run deploy
```

This command will:
1. Run `npm run build` (builds the static site)
2. Create an `out` folder with the static files
3. Push the contents to the `gh-pages` branch
4. GitHub will automatically serve it

---

### Step 4: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** tab
3. Scroll down to **Pages** section (left sidebar)
4. Under "Source", select:
   - Branch: `gh-pages`
   - Folder: `/ (root)`
5. Click **Save**

---

### Step 5: Access Your App

After 2-3 minutes, your app will be live at:
```
https://YOUR-USERNAME.github.io/copilot-adoption-navigator/
```

Replace `YOUR-USERNAME` with your actual GitHub username.

---

## 🔄 Updating Your Deployed App

Whenever you make changes:

```powershell
# 1. Commit your changes
git add .
git commit -m "Description of changes"

# 2. Push to main branch
git push origin main

# 3. Deploy to GitHub Pages
npm run deploy
```

---

## 🎯 Quick Commands Reference

```powershell
# First-time setup
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR-USERNAME/copilot-adoption-navigator.git
git push -u origin main
npm run deploy

# Future updates
git add .
git commit -m "Your message"
git push
npm run deploy
```

---

## ⚠️ Important Notes

### GitHub Username Required
You'll need to replace `YOUR-USERNAME` with your actual GitHub username in:
- The repository URL
- The final GitHub Pages URL

### Public vs Private Repository
- **Public**: Anyone can access your app
- **Private**: Only you (and collaborators) can access
- GitHub Pages works with both, but private repos require GitHub Pro

### Data Persistence
- Feedback system uses **browser localStorage**
- Each user has their own feedback data
- To share feedback, users must export CSV and send to you

### Base Path
If you want to use a custom domain or repository name:
1. Update `next.config.js`:
   ```javascript
   const nextConfig = {
     basePath: '/your-repo-name',
     // ... rest of config
   }
   ```
2. Redeploy with `npm run deploy`

---

## 🐛 Troubleshooting

### "Repository not found" error
Make sure you've created the GitHub repository first and the URL is correct.

### "Permission denied" error
You may need to authenticate:
```powershell
gh auth login
```
Or use HTTPS with personal access token.

### 404 Page Not Found
- Wait 2-3 minutes after deployment
- Check GitHub Pages settings are correct (gh-pages branch)
- Clear browser cache and try again

### Build Fails
Check that all dependencies are installed:
```powershell
npm install
npm run build
```

---

## 📞 Need Help?

If you encounter any issues, let me know and I'll help troubleshoot!

---

## 🎉 You're Ready!

Run the commands in Step 1-3, and your app will be live on GitHub Pages!

