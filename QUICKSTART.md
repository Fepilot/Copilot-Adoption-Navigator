# Quick Start Guide

## 🚀 Get Started in 4 Steps

### 1️⃣ Install Node.js
Download from: **https://nodejs.org/** (LTS version)

### 2️⃣ Install Dependencies
```powershell
npm install
```

### 3️⃣ Generate Rules from CSV
```powershell
npm run gen:rules
```

### 4️⃣ Start the App
```powershell
npm run dev
```

Then open: **http://localhost:3000**

---

## 📋 What to Expect

1. **Landing Page** - Corporate Microsoft/Copilot branding with "Start now" button
2. **Inputs Page** - Enter your Copilot metrics (usage, adoption, features, etc.)
3. **Results Page** - View triggered recommendations with filters and sorting
4. **Download Excel** - Export your action plan as Excel workbook

---

## 🎯 User Flow

```
Landing (/) 
    ↓ [Start now]
Inputs (/inputs)
    ↓ [Enter metrics]
    ↓ [Generate Recommendations]
Results (/results)
    ↓ [Download Excel]
Excel Report (copilot-adoption-tracker.xlsx)
```

---

## 📊 Metrics You'll Input

Based on your CSV, the app will ask for inputs across these categories:

- **Usage Summary** (active users %, weekly actions)
- **Usage Trends Over Time** (spikes, drops, growth)
- **Usage Thresholds** (user tiers, power users)
- **Usage Since Activation** (ramp speed, adoption rate)
- **Feature Usage** (app breadth, feature utilization)
- **Usage Heatmap** (team/regional differences)
- **Copilot-Assisted Hours** (time saved metrics)
- **Work Patterns** (behavior changes)

---

## 💡 Tips

- **Fill in as many fields as possible** for accurate recommendations
- **Use filter and sort** on results page to prioritize actions
- **Download Excel** to track implementation progress
- **Resources column** in results has links to Microsoft learning materials

---

## 🔧 Troubleshooting

**Q: I don't have Node.js installed**  
A: Go to nodejs.org and download the LTS version for Windows

**Q: npm command not recognized**  
A: Restart your terminal/PowerShell after installing Node.js

**Q: Port 3000 in use**  
A: Change port with `$env:PORT=3001; npm run dev`

**Q: No recommendations showing**  
A: Your metrics might be within target ranges (good job!)

---

## 📞 Need Help?

1. Read `SETUP.md` for detailed instructions
2. Check `README.md` for full documentation
3. Look at browser console for errors
4. Review terminal logs

---

**Built with:** Next.js 14 | TypeScript | Tailwind CSS | Zustand | ExcelJS

**© 2025 Microsoft Corporation**
