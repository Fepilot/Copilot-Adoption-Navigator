# Setup Guide for Copilot Adoption Navigator

## ⚠️ IMPORTANT: Node.js Required

This project requires **Node.js** to run. It is currently **NOT installed** on your system.

## Step 1: Install Node.js

1. Go to: **https://nodejs.org/**
2. Download the **LTS (Long Term Support)** version for Windows
3. Run the installer
4. Follow the installation wizard (keep all default settings)
5. Restart your computer or at least your terminal/PowerShell

### Verify Installation

After installing Node.js, open PowerShell and run:

```powershell
node --version
npm --version
```

You should see version numbers (e.g., v20.x.x and 10.x.x)

## Step 2: Install Project Dependencies

Once Node.js is installed, navigate to your project folder and run:

```powershell
cd "C:\Users\fernandobe\Desktop\Copilot-adoption-navigator"
npm install
```

This will install all required dependencies listed in `package.json`.

## Step 3: Generate Rules from CSV

The CSV file has been placed in the `/data` folder. Generate the rules JSON:

```powershell
npm run gen:rules
```

This creates `app/data/rules.json` from your CSV file.

## Step 4: Run the Development Server

```powershell
npm run dev
```

Open your browser to: **http://localhost:3000**

## Step 5: Build for Production (Optional)

To create a production build:

```powershell
npm run build
npm start
```

## Project Structure Overview

```
Copilot-adoption-navigator/
│
├── app/                          # Next.js App Router
│   ├── page.tsx                  # Landing page (/)
│   ├── inputs/page.tsx           # Inputs page (/inputs)
│   ├── results/page.tsx          # Results page (/results)
│   ├── layout.tsx                # Root layout
│   ├── globals.css               # Global styles
│   ├── lib/                      # Core logic
│   │   ├── evaluation.ts         # Rule evaluation engine
│   │   ├── excel.ts              # Excel export
│   │   ├── schemas.ts            # TypeScript types & Zod schemas
│   │   └── store.ts              # Zustand state management
│   └── data/                     # Generated rules
│       ├── rules.json            # (generated from CSV)
│       └── rules.seed.ts         # Fallback data
│
├── data/                         # Source data
│   └── copilot_adoption_tracking_enhanced.csv
│
├── scripts/                      # Build scripts
│   └── build-rules.mjs           # CSV → JSON parser
│
├── __tests__/                    # Tests
│   └── evaluation.test.ts        # Evaluation tests
│
├── package.json                  # Dependencies & scripts
├── tsconfig.json                 # TypeScript config
├── tailwind.config.js            # Tailwind CSS config
├── vitest.config.ts              # Test config
├── next.config.js                # Next.js config
└── README.md                     # Documentation
```

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server (http://localhost:3000) |
| `npm run build` | Build for production (runs gen:rules first) |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm test` | Run tests with Vitest |
| `npm run gen:rules` | Generate rules.json from CSV |

## Features Implemented

### ✅ Landing Page (/)
- Corporate Microsoft/Copilot branding
- "Start now" CTA button
- Feature highlights
- "How it works" section

### ✅ Inputs Page (/inputs)
- Dynamic sections for each **Metric** category from CSV
- Input fields for each scenario with target hints
- Validates and stores inputs in Zustand store
- "Generate Recommendations" button

### ✅ Results Page (/results)
- Lists triggered recommendations
- Filter by Metric category
- Sort by Gap or Effort
- Shows "Your Value vs Target"
- Download Excel report button

### ✅ Evaluation Engine
- Compares user inputs against targets
- Supports threshold (`< 50`, `> 100`)
- Supports ranges (`10-20%`)
- Supports labels (text matching)
- Calculates gap and gap percentage
- Estimates effort (low/medium/high)

### ✅ Excel Export
- Generates .xlsx file
- Matches original Adoption Tracker format
- Columns A-E & M filled
- Columns F-L empty for tracking
- Microsoft blue header styling

### ✅ CSV Rules Engine
- `build-rules.mjs` parses CSV
- Extracts Metric, Scenario, Action, Resources, Target
- Parses targets into structured format
- Groups rules by Metric
- Outputs `rules.json`

### ✅ TypeScript & Validation
- Strict TypeScript mode enabled
- Zod schemas for all data structures
- Type-safe throughout

### ✅ State Management
- Zustand store for global state
- Persisted to localStorage
- Inputs and results stored

### ✅ Testing
- Vitest configured
- Unit tests for evaluation engine
- Tests for threshold, range, gap calculation, effort estimation

### ✅ Styling
- Tailwind CSS with custom Microsoft colors
- Responsive design
- Modern UI components
- Phosphor React icons

## Troubleshooting

### Issue: `npx: command not found`
**Solution**: Install Node.js (see Step 1 above)

### Issue: `Cannot find module 'next'`
**Solution**: Run `npm install` to install dependencies

### Issue: `rules.json not found`
**Solution**: Run `npm run gen:rules` to generate rules from CSV

### Issue: Port 3000 already in use
**Solution**: 
```powershell
# Find and kill process using port 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or use a different port
$env:PORT=3001; npm run dev
```

### Issue: Excel download not working
**Solution**: Check browser console for errors, ensure exceljs is installed

## Next Steps

1. **Install Node.js** (if not done)
2. **Run `npm install`**
3. **Run `npm run gen:rules`** to process CSV
4. **Run `npm run dev`** to start app
5. **Open http://localhost:3000** in browser

## CSV File Location

Your CSV file is already in place:
```
C:\Users\fernandobe\Desktop\Copilot-adoption-navigator\data\copilot_adoption_tracking_enhanced.csv
```

## Support

For issues or questions:
1. Check the README.md
2. Review this SETUP.md
3. Check browser console for errors
4. Review Next.js logs in terminal

## License

Microsoft Corporation © 2025
