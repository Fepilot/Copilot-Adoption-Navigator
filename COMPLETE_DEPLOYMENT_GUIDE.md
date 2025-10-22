# 🚀 Complete GitHub Pages Setup Guide

## ✅ What I've Done For You

I've configured your project for GitHub Pages deployment:
- ✅ Added deployment scripts to package.json
- ✅ Configured next.config.js for static export
- ✅ Installed gh-pages package

---

## 📋 Prerequisites

### 1. Install Git (if not already installed)

**Download and Install:**
- Go to: https://git-scm.com/download/win
- Download the installer
- Run the installer (use default settings)
- Restart PowerShell after installation

**Or use winget (Windows Package Manager):**
```powershell
winget install --id Git.Git -e --source winget
```

**Verify installation:**
```powershell
git --version
```

### 2. Create GitHub Account (if needed)
- Go to: https://github.com/signup
- Follow the registration process

---

## 🎯 Quick Start: 3 Easy Steps

### Step 1: Initialize Git & Commit

Open PowerShell in your project folder and run:

```powershell
# Initialize git repository
git init

# Configure git (replace with your info)
git config user.name "Your Name"
git config user.email "your.email@example.com"

# Add all files
git add .

# Create first commit
git commit -m "Initial commit - Copilot Adoption Navigator with Feedback System"
```

---

### Step 2: Create GitHub Repository

**Two options:**

#### Option A: Using GitHub Website (Easier)

1. **Go to GitHub**: https://github.com/new

2. **Repository Settings:**
   - Repository name: `copilot-adoption-navigator`
   - Description: "Copilot Adoption Navigator - Turn Super User reports into actionable recommendations"
   - Choose: **Public** (recommended) or Private
   - ❌ **Do NOT check** "Initialize with README"
   - ❌ **Do NOT add** .gitignore or license

3. **Click "Create repository"**

4. **Connect your local repo** (copy the commands GitHub shows):
   ```powershell
   git remote add origin https://github.com/YOUR-USERNAME/copilot-adoption-navigator.git
   git branch -M main
   git push -u origin main
   ```

   Replace `YOUR-USERNAME` with your actual GitHub username!

#### Option B: Using GitHub CLI (Advanced)

If you have GitHub CLI installed:
```powershell
# Login to GitHub
gh auth login

# Create and push repository
gh repo create copilot-adoption-navigator --public --source=. --remote=origin --push
```

---

### Step 3: Deploy to GitHub Pages

```powershell
# Deploy your app
npm run deploy
```

**What happens:**
1. ✅ Builds your app (`npm run build`)
2. ✅ Creates static files in `out` folder
3. ✅ Pushes to `gh-pages` branch
4. ✅ GitHub automatically serves your site

---

### Step 4: Enable GitHub Pages

1. **Go to your repository** on GitHub
   - URL: `https://github.com/YOUR-USERNAME/copilot-adoption-navigator`

2. **Click "Settings"** tab (top right)

3. **Click "Pages"** in left sidebar

4. **Under "Build and deployment":**
   - Source: **Deploy from a branch**
   - Branch: **gh-pages** (select from dropdown)
   - Folder: **/ (root)**
   - Click **Save**

5. **Wait 2-3 minutes** for deployment

6. **Your app will be live at:**
   ```
   https://YOUR-USERNAME.github.io/copilot-adoption-navigator/
   ```

---

## 🎉 You're Live!

Share this URL with your team:
```
https://YOUR-USERNAME.github.io/copilot-adoption-navigator/
```

---

## 🔄 Making Updates Later

When you make changes to your app:

```powershell
# 1. Save and commit changes
git add .
git commit -m "Description of what you changed"

# 2. Push to GitHub
git push origin main

# 3. Deploy updated version
npm run deploy
```

Your site will update in 2-3 minutes!

---

## 📱 Sharing With Your Team

Once deployed, simply share the URL:
```
https://YOUR-USERNAME.github.io/copilot-adoption-navigator/
```

**Features your team can use:**
- ✅ Browse all pages (Inputs, Results, Plans, Evidence)
- ✅ Submit feedback via purple chat button
- ✅ Test the complete workflow
- ✅ Export data to Excel

**Note:** Feedback is stored in each user's browser localStorage. To collect all feedback:
- Ask team members to click "Export CSV" from the Feedback Dashboard
- They send you the CSV files
- You can combine them for analysis

---

## 🔐 Authentication (Optional)

If you get authentication errors when pushing to GitHub:

### Option 1: Personal Access Token (Recommended)

1. Go to: https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Give it a name: "Copilot Navigator Deployment"
4. Select scopes: **repo** (all checkboxes)
5. Click "Generate token"
6. **Copy the token** (you won't see it again!)
7. When pushing to GitHub, use token as password:
   - Username: your GitHub username
   - Password: paste the token

### Option 2: SSH Key

```powershell
# Generate SSH key
ssh-keygen -t ed25519 -C "your.email@example.com"

# Copy public key
Get-Content ~/.ssh/id_ed25519.pub | clip

# Add to GitHub:
# Go to: https://github.com/settings/keys
# Click "New SSH key", paste, and save

# Change remote URL to SSH
git remote set-url origin git@github.com:YOUR-USERNAME/copilot-adoption-navigator.git
```

---

## 🐛 Troubleshooting

### "git: command not found"
- Install Git (see Prerequisites above)
- Restart PowerShell after installation

### "Repository not found" or "Permission denied"
- Check repository URL is correct
- Verify you're logged in to GitHub
- Use Personal Access Token for authentication

### "npm run deploy" fails
- First try: `npm run build` to check for errors
- Make sure all dependencies are installed: `npm install`
- Check that git repository is initialized: `git status`

### App shows 404 or blank page
- Wait 2-3 minutes after deployment
- Check GitHub Pages settings (gh-pages branch selected)
- Clear browser cache and try again
- Check GitHub Actions tab for deployment status

### Changes not appearing
- Make sure you ran `npm run deploy` (not just `git push`)
- Wait 2-3 minutes for GitHub to rebuild
- Hard refresh browser (Ctrl + Shift + R)

---

## 📊 What Gets Deployed

Your GitHub Pages site includes:
- ✅ Landing page with navigation
- ✅ Inputs page for metrics
- ✅ Results page with recommendations
- ✅ Plans page (Kanban board)
- ✅ Evidence page (leaderboard)
- ✅ Feedback Dashboard
- ✅ Floating feedback widget on all pages
- ✅ All styling and assets

**Note:** This is a **static site**. Features that work:
- ✅ All navigation and UI
- ✅ Browser localStorage (feedback, plans, evidence)
- ✅ CSV/Excel export
- ❌ Server-side APIs (none needed for this app)
- ❌ Database (using localStorage instead)

---

## 🎯 Quick Command Reference

```powershell
# Initial setup (one time)
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR-USERNAME/copilot-adoption-navigator.git
git push -u origin main
npm run deploy

# Making updates (repeat as needed)
git add .
git commit -m "Updated feature X"
git push
npm run deploy

# Check status
git status
git log --oneline

# View branches
git branch -a
```

---

## 💡 Pro Tips

1. **Custom Domain**: You can add a custom domain in GitHub Pages settings
2. **Analytics**: Add Google Analytics by creating a `_app.tsx` component
3. **HTTPS**: Automatically enabled by GitHub Pages
4. **Versioning**: Each commit is tracked, you can roll back if needed
5. **Collaboration**: Add team members as collaborators in repository settings

---

## 📞 Need Help?

If you get stuck at any step, let me know and I'll help troubleshoot!

**Common questions:**
- "Where do I find my GitHub username?" - Top-right corner when logged into GitHub
- "What if I want a private repository?" - Choose Private in Step 2, works the same way
- "Can I change the repository name later?" - Yes, in repository Settings

---

## ✅ Ready to Deploy?

Follow the steps above, and your app will be live on the internet in about 10 minutes!

**Your URL will be:**
```
https://YOUR-USERNAME.github.io/copilot-adoption-navigator/
```

🚀 Good luck with your deployment!

