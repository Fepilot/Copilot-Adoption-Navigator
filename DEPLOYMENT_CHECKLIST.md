# ✅ GitHub Pages Deployment Checklist

## Quick Reference - Follow These Steps in Order

---

### ☐ Step 1: Install Git (If Needed)

Check if Git is installed:
```powershell
git --version
```

If not installed, download from: **https://git-scm.com/download/win**

Or install via winget:
```powershell
winget install --id Git.Git -e --source winget
```

**Then restart PowerShell!**

---

### ☐ Step 2: Initialize Git Repository

```powershell
# Navigate to project folder
cd C:\Users\fernandobe\Desktop\Copilot-adoption-navigator

# Initialize git
git init

# Configure your identity (replace with your info)
git config user.name "Your Name"
git config user.email "your.email@example.com"

# Add all files
git add .

# Create first commit
git commit -m "Initial commit - Copilot Adoption Navigator"
```

---

### ☐ Step 3: Create GitHub Repository

1. Go to: **https://github.com/new**

2. Fill in:
   - Repository name: `copilot-adoption-navigator`
   - Description: "Copilot Adoption Navigator"
   - Visibility: **Public** (or Private if you prefer)
   - ❌ **Do NOT** check "Add README"
   - ❌ **Do NOT** add .gitignore or license

3. Click **"Create repository"**

---

### ☐ Step 4: Link Local Repository to GitHub

After creating the repository, GitHub will show you commands. Run them:

```powershell
# Replace YOUR-USERNAME with your GitHub username!
git remote add origin https://github.com/YOUR-USERNAME/copilot-adoption-navigator.git
git branch -M main
git push -u origin main
```

**If prompted for credentials:**
- Username: Your GitHub username
- Password: Use a Personal Access Token (not your password)
  - Get token at: https://github.com/settings/tokens

---

### ☐ Step 5: Deploy to GitHub Pages

```powershell
npm run deploy
```

This will:
- Build your app
- Create static files
- Push to gh-pages branch
- Takes about 1-2 minutes

---

### ☐ Step 6: Enable GitHub Pages

1. Go to your repository: `https://github.com/YOUR-USERNAME/copilot-adoption-navigator`

2. Click **"Settings"** tab

3. Click **"Pages"** in left sidebar

4. Under "Build and deployment":
   - Source: **Deploy from a branch**
   - Branch: **gh-pages**
   - Folder: **/ (root)**

5. Click **"Save"**

6. Wait 2-3 minutes

---

### ☐ Step 7: Access Your Live App!

Your app is now live at:
```
https://YOUR-USERNAME.github.io/copilot-adoption-navigator/
```

(Replace YOUR-USERNAME with your actual GitHub username)

---

## 🎉 Done! Share the URL with your team!

---

## 🔄 Future Updates

Whenever you make changes:

```powershell
git add .
git commit -m "Description of changes"
git push origin main
npm run deploy
```

---

## 📞 Need Help?

- **Detailed guide**: See `COMPLETE_DEPLOYMENT_GUIDE.md`
- **Troubleshooting**: See the guide for common issues
- **Questions**: Let me know!

