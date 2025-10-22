# Quick Start Guide - Plan-Execute-Evidence Loop

## 🚀 Get Started in 3 Minutes

### Prerequisites
- Node.js installed
- PowerShell (Windows) or Terminal (Mac/Linux)

### Step 1: Start the App (30 seconds)
```powershell
# Windows PowerShell
$env:Path += ";C:\Program Files\nodejs"
cd C:\Users\fernandobe\Desktop\Copilot-adoption-navigator
npm run dev
```

Visit **http://localhost:3000**

### Step 2: Try the Basic Flow (60 seconds)
1. Click **"Get Started"** on landing page
2. Click **"Load Sample Data"** button
3. Click **"Generate Recommendations"** button
4. Review recommendations with gap analysis
5. Click **"Download Excel Report"** to export

✅ You've just generated targeted recommendations!

### Step 3: Try the Plan-Execute-Evidence Loop (90 seconds)

#### Add to Plan
1. On Results page, click **"Add to Plan"** on any recommendation
2. Alert confirms: "Added to plan: Adoption Plan [date]"
3. Button changes to "In Plan" (disabled)

#### View Plans
4. Navigate to **Plans** page from home
5. See your plan with the recommendation in "Planned" column
6. Click **"Load Sample Data"** to see 3 full example plans

#### Start Execution
7. Back on Results page, click **"Start"** on the recommendation
8. Button changes to "Started" (green)
9. On Plans page, see it moved to "In Progress" column

#### View Evidence
10. Navigate to **Evidence** page from home
11. See leaderboard with sample data:
    - 🏆 75% Win Rate
    - 📈 +2.6 Avg Delta
    - 👥 33% Avg Coverage
    - ⚡ 68% Avg Persistence
12. Click any recommendation to see before/after details
13. Click **"Export Evidence Card"** to download JSON report

## 📊 Understanding the Evidence Score

### Formula
```
Evidence Score = Delta × Coverage × Persistence
```

### Example from Sample Data
**Recommendation**: "Implement habit-forming prompts to increase daily engagement"

- **Baseline**: 3 weekly actions per user
- **Final**: 7.1 weekly actions per user
- **Delta**: +4.1 (137% improvement)
- **Coverage**: 30% (3 engagement events)
- **Persistence**: 80% (2 checkpoints over 10 weeks)
- **Evidence Score**: 4.1 × 0.3 × 0.8 = **0.984**
- **Success**: ✓ Yes (exceeded 10% threshold)

### What This Means
- **Higher Delta** = Bigger improvement
- **Higher Coverage** = More people reached
- **Higher Persistence** = Longer sustained impact
- **Higher Evidence Score** = Stronger proof of success

## 🎯 Key Actions

### On Results Page
- **Add to Plan**: Creates plan and adds recommendation
- **Start**: Marks as in progress, tracks event
- **Mark Success**: Records positive outcome
- **Didn't Help**: Records negative outcome
- **Feedback**: Submit qualitative insights

### On Plans Page
- **Load Sample Data**: Generate 3 example plans
- **Create Plan**: Add new adoption initiative
- **Update Status**: Move plan between states
- **View Kanban**: See recommendations by status

### On Evidence Page
- **View Leaderboard**: See aggregate statistics
- **Drill Down**: Click recommendations for details
- **Export Card**: Download evidence report

## 🔄 Complete Flow Example

### Scenario: Low Active Users

1. **Discovery** (Inputs page)
   - Enter: 42% active users
   - Target: 95/100% licence utilization
   - Generate recommendations

2. **Planning** (Results page)
   - See recommendation: "Launch awareness campaign..."
   - Click "Add to Plan"
   - Plan created: "Adoption Plan 10/14/2025"

3. **Execution** (Results + Plans)
   - Click "Start" on Results page
   - On Plans page, see in "In Progress" column
   - Log activities:
     - Send weekly tips email (250 recipients)
     - Host lunch & learn (45 attendees)
     - Assign learning modules (120 users)

4. **Capture** (Database)
   - Record baseline: 42% active users
   - Record checkpoint: 48% active users (week 2)
   - Record final: 58% active users (week 8)
   - Submit feedback: "Weekly tips really helped!"

5. **Outcome** (Results page)
   - Click "Mark Success"
   - System calculates:
     - Delta: +16 (38% improvement)
     - Coverage: 30% (3 engagement events)
     - Persistence: 80% (1 checkpoint, 8 weeks)
     - Evidence Score: 16 × 0.3 × 0.8 = 3.84

6. **Evidence** (Evidence page)
   - See on leaderboard (high evidence score)
   - Click to view details
   - Export Evidence Card for executive report
   - Share success story with stakeholders

## 🎨 Visual Guide

### Results Page Buttons
```
[Add to Plan] → Creates plan, adds recommendation
[Start] → Begins execution, tracks event
[Mark Success] → Records win, calculates evidence
[Didn't Help] → Records failure, learns from it
[Feedback] → Opens modal for qualitative input
```

### Plans Page Kanban
```
┌─────────────┬─────────────┬─────────────┐
│  📋 Planned │ 🚀 In Progress │  ✅ Done    │
├─────────────┼─────────────┼─────────────┤
│  Not started│  Started    │  Completed  │
│  No events  │  Has events │  Has outcome│
└─────────────┴─────────────┴─────────────┘
```

### Evidence Page Stats
```
🏆 Win Rate        📈 Avg Delta
   75%                +2.6
   (3 of 4 succeeded) (Average improvement)

👥 Avg Coverage    ⚡ Avg Persistence  
   33%                68%
   (Audience reached) (Sustained impact)
```

## 💡 Pro Tips

### Maximize Evidence Score
1. **Increase Delta**: Choose high-impact recommendations
2. **Increase Coverage**: Run multiple engagement activities
3. **Increase Persistence**: Track checkpoints regularly

### Best Practices
- Record baseline BEFORE starting execution
- Log events as they happen (don't batch)
- Capture checkpoints every 1-2 weeks
- Record final value after observation window (4-12 weeks)
- Submit feedback with specific quotes and data

### Common Patterns
- **Quick Win**: High delta, low coverage, low persistence
- **Sustained Success**: Moderate delta, high coverage, high persistence
- **Scale Impact**: Moderate delta, high coverage, moderate persistence

## 🆘 Troubleshooting

### Q: Buttons are disabled
**A**: Follow the sequence: Add to Plan → Start → Mark Success/Fail

### Q: No data on Evidence page
**A**: Click "Load Sample Data" on Plans page first

### Q: Evidence Score is 0
**A**: Need baseline and final snapshots in database (use sample data to see examples)

### Q: localStorage not saving
**A**: Check browser privacy settings, localStorage must be enabled

## 📚 Next Steps

- Read the full [README.md](README.md) for detailed documentation
- Review [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md) for technical details
- Explore sample data to understand the complete flow
- Start tracking your own Copilot adoption initiatives!

## 🎉 You're Ready!

You now understand how to:
- ✅ Generate recommendations from metrics
- ✅ Organize recommendations into plans
- ✅ Track execution activities
- ✅ Measure outcomes with evidence scores
- ✅ Build proof of Copilot adoption success

**Happy adopting!** 🚀
