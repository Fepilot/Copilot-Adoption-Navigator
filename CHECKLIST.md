# 📋 Installation Checklist

Follow these steps in order to get your Copilot Adoption Navigator running.

---

## ☐ Step 1: Install Node.js

**Status:** ⏳ REQUIRED - Not yet installed

**What to do:**
1. Open your web browser
2. Go to: **https://nodejs.org/**
3. Click the green **"LTS"** (Long Term Support) download button
4. Run the downloaded installer (`node-v20.x.x-x64.msi` or similar)
5. Follow the installation wizard:
   - ✅ Accept the license agreement
   - ✅ Keep the default installation path
   - ✅ Keep all default components selected
   - ✅ Check "Automatically install necessary tools" if asked
6. Click "Finish"
7. **Restart your PowerShell/Terminal** (important!)

**Verify installation:**
```powershell
node --version
npm --version
```

You should see version numbers like:
```
v20.10.0
10.2.3
```

---

## ☐ Step 2: Navigate to Project Folder

**Status:** ✅ Folder already created

```powershell
cd "C:\Users\fernandobe\Desktop\Copilot-adoption-navigator"
```

---

## ☐ Step 3: Install Dependencies

**Status:** ⏳ Pending (do after Step 1)

```powershell
npm install
```

**Expected output:**
- Progress bars showing package downloads
- "added XXX packages" message
- Creation of `node_modules` folder
- **Time:** ~2-5 minutes depending on internet speed

---

## ☐ Step 4: Generate Rules from CSV

**Status:** ⏳ Pending (do after Step 3)

```powershell
npm run gen:rules
```

**Expected output:**
```
📖 Reading CSV from: ./data/copilot_adoption_tracking_enhanced.csv
📊 Parsed 57 rows from CSV
✅ Generated 57 rules
📁 Output written to: ./app/data/rules.json
📊 Metrics found: Usage Summary, Usage Trends Over Time, ...
```

**What this does:**
- Reads your CSV file
- Parses targets (< 50%, > 100, etc.)
- Creates `app/data/rules.json`
- Groups rules by Metric category

---

## ☐ Step 5: Start Development Server

**Status:** ⏳ Pending (do after Step 4)

```powershell
npm run dev
```

**Expected output:**
```
  ▲ Next.js 14.2.15
  - Local:        http://localhost:3000
  - Network:      http://192.168.x.x:3000

✓ Ready in 2.5s
```

**Leave this terminal window open!** The server needs to keep running.

---

## ☐ Step 6: Open in Browser

**Status:** ⏳ Pending (do after Step 5)

1. Open your web browser (Chrome, Edge, Firefox, etc.)
2. Navigate to: **http://localhost:3000**

**You should see:**
- Landing page with Microsoft branding
- "Copilot Adoption Navigator" title
- "Start now" button
- Feature cards and "How it works" section

---

## ☐ Step 7: Test the Application

**Status:** ⏳ Pending (do after Step 6)

### Test Flow:
1. **Landing Page** → Click "Start now"
2. **Inputs Page** → Enter sample metrics:
   - Usage Summary - Low % active users: `30`
   - Usage Summary - Low weekly actions: `5`
   - Feature Usage - Usage concentrated in few apps: `2`
3. Click **"Generate Recommendations"**
4. **Results Page** → You should see:
   - Number of triggered recommendations
   - Recommendation cards with:
     - Metric badge
     - Effort badge
     - Your value vs target
     - Recommended action
     - Resources
     - Gap calculation
5. Click **"Download Excel"** → Should download `.xlsx` file

---

## 🎯 Optional Steps (For Later)

### ☐ Run Tests
```powershell
npm test
```

### ☐ Run Linter
```powershell
npm run lint
```

### ☐ Build for Production
```powershell
npm run build
```

### ☐ Start Production Server
```powershell
npm start
```

---

## ✅ Success Criteria

You'll know it's working when:
- ✅ No error messages in terminal
- ✅ Browser shows landing page correctly
- ✅ Can navigate to /inputs page
- ✅ Can fill in metrics
- ✅ Can generate recommendations
- ✅ Can download Excel report
- ✅ Excel file opens and has correct format

---

## 🐛 Troubleshooting

### Issue: `node: command not found`
**Solution:** Node.js not installed or terminal not restarted. Install Node.js and restart PowerShell.

### Issue: `npm install` fails
**Solution:** 
- Make sure you're in the correct folder
- Check internet connection
- Try: `npm cache clean --force` then `npm install` again

### Issue: Port 3000 already in use
**Solution:**
```powershell
# Option 1: Use different port
$env:PORT=3001; npm run dev

# Option 2: Kill process on port 3000
netstat -ano | findstr :3000
taskkill /PID <PID_NUMBER> /F
```

### Issue: `Cannot find module 'next'`
**Solution:** Run `npm install` to install dependencies

### Issue: No recommendations showing
**Solution:** 
- Check if you entered values that trigger rules
- Try entering low values (e.g., 10, 20) for percentage fields
- Check browser console (F12) for errors

### Issue: Excel download not working
**Solution:**
- Check browser console (F12) for errors
- Make sure ExcelJS is installed: `npm install exceljs`
- Try a different browser

---

## 📞 Need More Help?

Refer to these files:
1. **QUICKSTART.md** - Quick 4-step guide
2. **SETUP.md** - Detailed setup instructions
3. **README.md** - Full project documentation
4. **PROJECT_SUMMARY.md** - Complete overview

---

## 📁 Files Created

All files are in:
```
C:\Users\fernandobe\Desktop\Copilot-adoption-navigator\
```

**Total files created:** 30+

Key files:
- ✅ package.json (dependencies)
- ✅ tsconfig.json (TypeScript config)
- ✅ next.config.js (Next.js config)
- ✅ tailwind.config.js (styling)
- ✅ app/page.tsx (landing page)
- ✅ app/inputs/page.tsx (inputs page)
- ✅ app/results/page.tsx (results page)
- ✅ app/lib/evaluation.ts (evaluation engine)
- ✅ app/lib/excel.ts (Excel export)
- ✅ scripts/build-rules.mjs (CSV parser)
- ✅ data/copilot_adoption_tracking_enhanced.csv (your data)
- ✅ README.md, SETUP.md, QUICKSTART.md (docs)

---

## 🎉 You're All Set!

Once you complete all steps with ✅ checkmarks, your Copilot Adoption Navigator will be fully operational!

**Current status:** Ready for Node.js installation

**Next action:** Install Node.js from nodejs.org

---

**Built for Microsoft Copilot Adoption**

© 2025 Microsoft Corporation
