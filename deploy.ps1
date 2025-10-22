# GitHub Pages Deployment Script
# Run this script to deploy your app to GitHub Pages

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "GitHub Pages Deployment Script" -ForegroundColor Cyan  
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Add Git to PATH
$env:Path += ";C:\Program Files\Git\cmd"

# Check if git remote exists
Write-Host "Checking git configuration..." -ForegroundColor Yellow
$remoteUrl = git remote get-url origin 2>$null

if (-not $remoteUrl) {
    Write-Host "Adding remote origin..." -ForegroundColor Yellow
    git remote add origin https://github.com/Fepilot/Copilot-Adoption-Navigator.git
}

# Show remote
Write-Host "Remote URL:" -ForegroundColor Green
git remote -v

# Commit any changes
Write-Host ""
Write-Host "Committing changes..." -ForegroundColor Yellow
git add .
git commit -m "Update app - preparing for deployment"

# Push to main
Write-Host ""
Write-Host "Pushing to main branch..." -ForegroundColor Yellow
git push origin main

# Deploy to GitHub Pages
Write-Host ""
Write-Host "Deploying to GitHub Pages..." -ForegroundColor Yellow
npm run deploy

Write-Host ""
Write-Host "==================================" -ForegroundColor Green
Write-Host "Deployment Complete!" -ForegroundColor Green
Write-Host "==================================" -ForegroundColor Green
Write-Host ""
Write-Host "Your app should be live in 2-3 minutes at:" -ForegroundColor Cyan
Write-Host "https://fepilot.github.io/Copilot-Adoption-Navigator/" -ForegroundColor White
Write-Host ""
