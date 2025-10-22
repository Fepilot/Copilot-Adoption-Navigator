# Copilot Adoption Navigator

A production-ready web application that transforms Copilot usage metrics into targeted, actionable recommendations with a complete **Plan-Execute-Evidence loop** for tracking outcomes.

## 🎯 Features

### Core Functionality
- **Smart Metric Analysis**: Parse CSV-backed adoption metrics and evaluate against proven benchmarks
- **Targeted Recommendations**: Generate personalized guidance based on 56 rules across 9 metric categories
- **Excel Export**: Download recommendations in adoption tracker format
- **Sample Data**: Quick demo mode with pre-populated metrics

### Plan-Execute-Evidence Loop ✨ NEW
- **Plans Management**: Organize recommendations into actionable plans with Kanban board (Planned → In Progress → Done → Archived)
- **Action Tracking**: Add recommendations to plans, start execution, track activities
- **Event Telemetry**: Capture 9 event types (ADDED_TO_PLAN, STARTED, OUTREACH_SENT, EVENT_HELD, LEARNING_ASSIGNED, CHECKPOINT_SNAPSHOT, FEEDBACK_GIVEN, MARKED_SUCCESS, MARKED_FAIL)
- **Feedback Collection**: Gather qualitative insights, quotes, and success stories
- **Metric Snapshots**: Capture baseline, checkpoint, and final metric values
- **Evidence Scoring**: Calculate `delta × coverage × persistence` for each recommendation
- **Leaderboard**: View win rate, avg delta, coverage, and persistence across all initiatives
- **Evidence Cards**: Export detailed before/after reports with engagement stats and quotes

## 📊 Architecture

### Tech Stack
- **Framework**: Next.js 14 (App Router) with TypeScript
- **Styling**: Tailwind CSS with Microsoft Design System colors
- **State Management**: Zustand with localStorage persistence
- **Data Storage**: In-memory database with localStorage persistence (client-side)
- **Validation**: Zod schemas for type-safe data handling
- **CSV Parsing**: csv-parse with UTF-8 BOM handling
- **Excel Export**: ExcelJS for generating .xlsx reports
- **Icons**: Phosphor React

### Project Structure
```
app/
├── page.tsx                    # Landing page with navigation
├── inputs/page.tsx             # Metric input form (9 categories, no duplicates)
├── results/page.tsx            # Recommendations with action buttons
├── plans/page.tsx              # Kanban board for plan management
├── evidence/page.tsx           # Leaderboard and evidence cards
├── lib/
│   ├── schemas.ts              # Zod validation schemas
│   ├── store.ts                # Zustand state management
│   ├── evaluation.ts           # Rule evaluation engine
│   ├── excel.ts                # Excel export functionality
│   ├── sample-data.ts          # Demo data for inputs
│   ├── database-schema.ts      # Data models (Plan, PlanRecommendation, Event, Feedback, Snapshot)
│   ├── telemetry.ts            # Event tracking system
│   ├── outcomes.ts             # Evidence score calculations
│   └── seed-data.ts            # Mock data for plans/events/snapshots
└── globals.css                 # Global styles + Tailwind

data/
└── copilot_adoption_tracking_enhanced.csv  # 56 rules catalog

scripts/
└── build-rules.mjs             # CSV parser (build-time)

public/
└── rules.json                  # Generated rules (56 entries)
```

## 🚀 Getting Started

### Prerequisites
- **Node.js 18+** and npm
- Windows PowerShell (or bash for Unix systems)

### Installation
```powershell
# Navigate to project directory
cd C:\Users\fernandobe\Desktop\Copilot-adoption-navigator

# Install dependencies
npm install

# Generate rules from CSV
npm run gen:rules

# Start development server
npm run dev
```

Visit **http://localhost:3000**

### Using Sample Data
1. **Inputs Page**: Click "Load Sample Data" to populate all 17 fields
2. **Plans Page**: Click "Load Sample Data" to generate 3 plans with 5 recommendations and 23 events
3. **Evidence Page**: View leaderboard with calculated evidence scores

## 📋 Complete Workflow

### Basic Workflow
1. **Enter Metrics** (`/inputs`): Fill in 9 metric categories or use sample data
2. **Generate Recommendations** (`/results`): View prioritized recommendations with gap analysis
3. **Export to Excel**: Download adoption tracker with all recommendations

### Plan-Execute-Evidence Workflow
4. **Add to Plan** (Results page): Click "Add to Plan" on any recommendation
5. **Start Execution** (Results page): Mark recommendations as "Started" to begin tracking
6. **View Plans** (`/plans`): See Kanban board with Planned, In Progress, Done columns
7. **Track Activities**: Log events manually or via telemetry (outreach, events, learning, checkpoints)
8. **Capture Snapshots**: Record baseline and final metric values in database
9. **Mark Outcome** (Results page): Mark recommendations as "Success" or "Didn't Help"
10. **View Evidence** (`/evidence`): See leaderboard with evidence scores and stats
11. **Drill Down**: Click any recommendation to see before/after details, quotes, engagement
12. **Export Evidence Card**: Download detailed report (JSON format, can be enhanced to PDF/PPTX)

## 📊 Data Models

### Plans
- **Fields**: id, tenantId, name, description, status, startDate, targetDate, completedDate, createdAt, updatedAt, createdBy
- **Status**: `planned` | `in_progress` | `done` | `archived`

### Plan Recommendations
- **Fields**: id, planId, recommendationId, metric, scenario, recommendation, resources, priority, addedAt, startedAt, completedAt
- **Lifecycle**: added → started → completed

### Recommendation Events
- **Types**: 9 event types for tracking execution activities
  - `ADDED_TO_PLAN`, `STARTED`, `OUTREACH_SENT`, `EVENT_HELD`, `LEARNING_ASSIGNED`, `CHECKPOINT_SNAPSHOT`, `FEEDBACK_GIVEN`, `MARKED_SUCCESS`, `MARKED_FAIL`
- **Fields**: id, planRecommendationId, eventType, eventData (JSON), recordedAt, recordedBy

### Feedback
- **Types**: `success` | `challenge` | `suggestion` | `quote`
- **Fields**: id, planRecommendationId, feedbackType, feedbackText, sentiment, submittedAt, submittedBy

### Metric Snapshots
- **Types**: `baseline` | `checkpoint` | `final`
- **Fields**: id, planId, metric, snapshotType, value, recordedAt, notes

### Evidence Score
- **Formula**: `delta × coverage × persistence`
- **Components**:
  - **Delta**: Absolute or percentage improvement from baseline to final
  - **Coverage**: % of target audience reached (0-1, based on engagement events)
  - **Persistence**: Sustained impact (0-1, based on checkpoint frequency and observation days)
- **Success Thresholds**: Per-metric improvement targets (5-20%)

## 🎨 UI Components

### Landing Page (`/`)
- Hero section with branding
- Feature cards
- Plan-Execute-Evidence section with links
- How It Works walkthrough

### Inputs Page (`/inputs`)
- 9 metric sections (ONE input section per metric, no duplicates)
- Field-specific inputs (% Active users, Weekly actions, Trend pattern, etc.)
- Helper text with target examples
- Sample data button for quick demo

### Results Page (`/results`)
- Filterable recommendations by metric
- Sortable by gap or effort
- Recommendation cards with:
  - Metric badge, scenario, recommendation text, resources
  - Gap analysis
  - 5 action buttons: **Add to Plan**, **Start**, **Mark Success**, **Didn't Help**, **Feedback**
- Feedback modal for collecting qualitative insights

### Plans Page (`/plans`)
- Multi-plan selector tabs
- Plan info card (name, description, dates, status dropdown)
- Kanban board with 3 columns:
  - 📋 **Planned** (not started)
  - 🚀 **In Progress** (started, not completed)
  - ✅ **Done** (completed)
- Recommendation cards showing:
  - Metric, scenario, recommendation snippet
  - Priority badge
  - Event count
  - Dates
- Load Sample Data button (when no plans exist)
- Delete plan functionality

### Evidence Page (`/evidence`)
- 4-stat leaderboard cards:
  - 🏆 **Win Rate**: % of recommendations marked successful
  - 📈 **Avg Delta**: Average improvement across all completed
  - 👥 **Avg Coverage**: Average audience reach
  - ⚡ **Avg Persistence**: Average sustained impact
- Top 10 recommendations by evidence score
- Click to view Evidence Details Modal:
  - Before/after values
  - Delta, coverage, persistence metrics
  - Evidence score with formula breakdown
  - Feedback quotes
  - Resources used
- Export Evidence Card button (downloads JSON)

## 🔧 Configuration

### Success Thresholds (`app/lib/outcomes.ts`)
```typescript
const SUCCESS_THRESHOLDS: Record<string, { deltaPercent?: number }> = {
  'Usage Summary': { deltaPercent: 10 },          // 10% improvement required
  'Usage Trends Over Time': { deltaPercent: 15 },
  'Feature Usage': { deltaPercent: 12 },
  'Copilot-Assisted Hours': { deltaPercent: 20 }, // 20% improvement required
  // ... more metrics
}
```

### Metric Input Fields (`app/inputs/page.tsx`)
```typescript
const metricInputConfig: Record<string, Array<InputField>> = {
  'Usage Summary': [
    { key: 'activeUsersPercent', label: '% Active users', type: 'number', helper: 'e.g., 42%' },
    { key: 'weeklyActions', label: 'Avg weekly actions per user', type: 'number', helper: 'e.g., 3' },
  ],
  'Usage Trends Over Time': [
    { key: 'trendPattern', label: 'Trend pattern', type: 'text', helper: 'e.g., Drop or plateau' },
  ],
  // ... 7 more metrics
}
```

## 🧪 Testing

### Manual Testing Checklist
- [x] Load sample data on inputs page
- [x] Generate recommendations and view results
- [x] Export to Excel and verify format
- [x] Add recommendations to plan (button states update)
- [x] Start and track recommendations (telemetry fires)
- [x] Record feedback via modal
- [x] Navigate to Plans page and view Kanban
- [x] Load sample data on Plans page
- [x] View evidence leaderboard
- [x] Drill into evidence details
- [x] Export evidence card (JSON download)
- [x] Verify localStorage persistence (refresh page)

### Test Data
- **Sample Inputs**: 17 fields across 9 metrics (`app/lib/sample-data.ts`)
- **Mock Plans**: 3 plans (In Progress, Planned, Done)
- **Mock Recommendations**: 5 recommendations with varied states
- **Mock Events**: 23 events across 9 types
- **Mock Feedback**: 3 feedback entries with quotes
- **Mock Snapshots**: 8 snapshots (baseline, checkpoint, final)

## 🎯 Key Metrics

### Rule Coverage
- **Total Rules**: 56 recommendations
- **Metrics**: 9 categories
- **Scenarios**: Varied (low usage, trends, thresholds, patterns)

### Evidence Calculation Examples
- **Win Rate**: If 3 out of 4 completed recommendations succeeded → 75%
- **Avg Delta**: If deltas are [+4.1, +1.0, -0.5] → Avg = +1.53
- **Avg Coverage**: If coverage values are [0.3, 0.4, 0.2] → Avg = 30%
- **Evidence Score**: Delta 4.1 × Coverage 0.3 × Persistence 0.8 = **0.984**

## 📝 CSV Format

### Required Columns (14 total)
- Metric, Scenario, Recommendation, Resources, Target
- TargetType, TargetValue, TargetOperator, TargetMin, TargetMax, TargetLabel
- Priority, Effort, Notes

### Example Row
```csv
Usage Summary,Low % active users,"Launch awareness campaign with weekly tips...",Email templates; Teams channels,95/100% Licence utilization,label,,,,,,1,medium,Target from best practices
```

## 🚀 Deployment

### Build for Production
```bash
npm run build
npm run start
```

### Environment Variables
No environment variables required. All data stored client-side in localStorage.

### Deployment Targets
- **Vercel** (recommended for Next.js)
- **Azure Static Web Apps**
- **Netlify**
- Any Node.js hosting provider

## 🔒 Security & Privacy

- **Client-Side Storage**: All data persists in browser localStorage
- **No Backend**: No server-side database or API calls (yet)
- **Tenant Scoping**: Tenant ID stubs (`demo-tenant-001`) for future multi-tenancy
- **Row-Level Security**: Stubs in database schema for future implementation

## 🛠️ Future Enhancements

### Backend & Database
- [ ] Backend API with PostgreSQL/Azure SQL
- [ ] Authentication (Azure AD, Microsoft Entra ID)
- [ ] Multi-tenancy with row-level security
- [ ] Server-side state sync

### Advanced Features
- [ ] PDF/PPTX export for evidence cards (with charts)
- [ ] Drag-and-drop Kanban status changes
- [ ] Real-time collaboration with SignalR
- [ ] Advanced analytics dashboard
- [ ] Email notifications for plan milestones
- [ ] Integration with Microsoft Teams/Power Automate
- [ ] AI-powered recommendation refinement with GPT-4

### UX Improvements
- [ ] Dark mode support
- [ ] Accessibility (WCAG 2.1 AA compliance)
- [ ] Mobile-responsive optimizations
- [ ] Inline editing on Plans page
- [ ] Bulk actions (archive multiple plans)
- [ ] Custom metric definitions

## 📦 Dependencies

```json
{
  "next": "14.2.15",
  "react": "^18",
  "typescript": "^5",
  "tailwindcss": "^3.4.1",
  "zustand": "^4.5.0",
  "zod": "^3.22.4",
  "csv-parse": "^5.5.3",
  "exceljs": "^4.4.0",
  "phosphor-react": "^1.4.1"
}
```

## 📄 License

© 2025 Microsoft Corporation. All rights reserved.

## 👥 Contributors

Built with ❤️ for Copilot adoption success.

---

## 🆘 Troubleshooting

### Node.js not found
**Windows PowerShell**: Add Node.js to PATH for the session:
```powershell
$env:Path += ";C:\Program Files\nodejs"
```

### CSV parsing errors
- Ensure CSV has UTF-8 BOM stripped (handled automatically in `scripts/build-rules.mjs`)
- Check column names match exactly (case-sensitive)

### localStorage not persisting
- Check browser privacy settings (localStorage must be enabled)
- Clear localStorage manually: Open DevTools → Application → Local Storage → Clear

### Missing rules.json
- Run `npm run gen:rules` to generate from CSV
- Check `public/rules.json` exists

---

**Need Help?** Check the inline comments in the code or refer to the comprehensive type definitions in `app/lib/database-schema.ts` and `app/lib/schemas.ts`.

**🎉 Ready to accelerate Copilot adoption!**
