# Testing Checklist - Plan-Execute-Evidence Loop

## ✅ Pre-Testing Setup

- [ ] Dev server is running: `npm run dev`
- [ ] Browser open to http://localhost:3000
- [ ] DevTools console open (F12) to monitor events

## 🧪 Test Suite 1: Basic Flow

### Landing Page
- [ ] Logo and branding visible
- [ ] "Get Started" button works
- [ ] Plan-Execute-Evidence section displays
- [ ] Links to /plans and /evidence pages work

### Inputs Page
- [ ] 9 metric sections display (no duplicates)
- [ ] "Load Sample Data" button populates all fields
- [ ] Sample data: 42% active users, 3 weekly actions, "Drop or plateau" trend
- [ ] "Generate Recommendations" button navigates to results

### Results Page
- [ ] Recommendations display with gap analysis
- [ ] Filter by metric works
- [ ] Sort by gap/effort works
- [ ] Excel export downloads file
- [ ] File opens correctly with columns A-E and M filled

**Expected**: ~10-20 recommendations based on sample data

## 🧪 Test Suite 2: Plan Management

### Add to Plan
- [ ] Click "Add to Plan" on first recommendation
- [ ] Alert shows: "Added to plan: Adoption Plan [date]"
- [ ] Button changes to "In Plan" (gray, disabled)
- [ ] Other recommendation buttons still enabled

### Start Recommendation
- [ ] "Start" button is now enabled (green)
- [ ] Click "Start"
- [ ] Alert shows: "Recommendation started!"
- [ ] Button changes to "Started" (green, disabled)

### Plans Page - First Visit
- [ ] Navigate to /plans
- [ ] See 1 plan created (from "Add to Plan" action)
- [ ] Plan shows in tabs at top
- [ ] Kanban has 3 columns: Planned, In Progress, Done
- [ ] Recommendation card in "In Progress" column
- [ ] Card shows:
  - Metric badge
  - Scenario name
  - Recommendation text (truncated)
  - Started date
  - Event count (should be 2: ADDED_TO_PLAN, STARTED)

### Load Sample Plans
- [ ] Click "Load Sample Data" button
- [ ] Alert shows: "✅ Sample data loaded! Explore the plans and recommendations."
- [ ] Now see 3 plans in tabs:
  - "Q4 2024 Adoption Boost" (In Progress)
  - "Regional Expansion Initiative" (Planned)
  - "Q3 2024 Pilot Program" (Done)
- [ ] Select each plan and verify Kanban updates

### Q4 2024 Adoption Boost (In Progress)
- [ ] Status badge: Green "IN_PROGRESS"
- [ ] Start date: 2024-10-01
- [ ] Target date: 2024-12-31
- [ ] Kanban columns:
  - Planned: 1 recommendation ("Deploy champions network...")
  - In Progress: 2 recommendations
  - Done: 0 recommendations
- [ ] In Progress cards show event counts (4-5 events each)

### Q3 2024 Pilot Program (Done)
- [ ] Status badge: Blue "DONE"
- [ ] Completed date: 2024-09-28
- [ ] Kanban columns:
  - Planned: 0
  - In Progress: 0
  - Done: 2 recommendations
- [ ] Done cards show event counts (6-7 events each)
- [ ] Cards have green left border

### Plan Status Management
- [ ] Select "Q4 2024 Adoption Boost" plan
- [ ] Change status dropdown from "In Progress" to "Done"
- [ ] Status badge updates to blue "DONE"
- [ ] Change back to "In Progress"

## 🧪 Test Suite 3: Evidence & Outcomes

### Evidence Page - First Visit (Before Sample Data)
- [ ] Navigate to /evidence
- [ ] See "No Evidence Yet" message
- [ ] "View Plans" button works

### Load Sample Data (if not already loaded)
- [ ] Go back to /plans
- [ ] Click "Load Sample Data"
- [ ] Return to /evidence

### Leaderboard Stats
- [ ] See 4 gradient stat cards:
  - 🏆 Win Rate: Should show percentage (e.g., 100% if both recs succeeded)
  - 📈 Avg Delta: Should show numeric value (e.g., 2.6)
  - 👥 Avg Coverage: Should show percentage (e.g., 33%)
  - ⚡ Avg Persistence: Should show percentage (e.g., 68%)

### Top Recommendations List
- [ ] See list of completed recommendations
- [ ] Each card shows:
  - Rank badge (#1, #2, etc.)
  - Metric badge
  - Success badge (green checkmark)
  - Scenario name
  - Evidence Score
  - Delta with percentage
  - Coverage percentage
  - Observation days
  - Export button (download icon)

### Evidence Details Modal
- [ ] Click any recommendation card
- [ ] Modal opens with:
  - Metric and scenario header
  - Success badge
  - Recommendation text
  - Before/after value boxes (Baseline vs Final)
  - 3 metric boxes (Delta, Coverage, Persistence)
  - Large Evidence Score box (gradient blue/purple)
  - Feedback & Quotes section (if available)
  - Resources Used section
- [ ] Click X to close modal
- [ ] Modal closes correctly

### Export Evidence Card
- [ ] Click "Export Evidence Card" button on any recommendation
- [ ] Alert shows: "📊 Evidence Card exported!"
- [ ] File downloads: `evidence-card-[metric-name].json`
- [ ] Open file and verify JSON structure:
  - metric, scenario, recommendation
  - baseline, final, delta, deltaPercent
  - evidenceScore, coverage, persistence, observationDays
  - activities array
  - quotes array
  - nextSteps

## 🧪 Test Suite 4: Feedback System

### Open Feedback Modal
- [ ] Go to /results
- [ ] Click "Feedback" button on any recommendation
- [ ] Modal opens with:
  - Title: "Share Your Feedback"
  - Textarea placeholder: "What worked? What didn't? Any suggestions?"
  - Cancel button
  - Submit button

### Submit Feedback
- [ ] Type feedback: "This recommendation was very helpful!"
- [ ] Click "Submit"
- [ ] Alert shows: "Thank you for your feedback!"
- [ ] Modal closes

### View Feedback in Evidence
- [ ] Ensure recommendation is marked as completed
- [ ] Go to /evidence
- [ ] Click the recommendation
- [ ] See feedback in "💬 Feedback & Quotes" section
- [ ] Verify text matches what was entered

## 🧪 Test Suite 5: Complete Workflow

### Scenario: Track New Recommendation End-to-End
1. **Clear localStorage** (DevTools → Application → Local Storage → Clear)
2. **Refresh page**
3. **Enter metrics** (/inputs)
   - Load sample data
   - Click "Generate Recommendations"
4. **Add to plan** (/results)
   - Click "Add to Plan" on first recommendation
   - Verify alert
5. **Start execution** (/results)
   - Click "Start" button
   - Verify alert
6. **View plan** (/plans)
   - Navigate to plans page
   - Verify recommendation in "In Progress" column
   - Verify event count = 2
7. **Submit feedback** (/results)
   - Click "Feedback" button
   - Enter: "Great recommendation!"
   - Submit
8. **Mark success** (/results)
   - Click "Mark Success" button
   - Verify button changes to "Success!" (disabled)
9. **View plan again** (/plans)
   - Recommendation should now be in "Done" column
   - Event count should be 3 or 4
10. **Check evidence** (/evidence)
    - Should see updated leaderboard stats
    - Find the recommendation in top list
    - Click to view details
    - Verify feedback appears in modal

## 🧪 Test Suite 6: Persistence & State

### localStorage Persistence
- [ ] Complete Test Suite 5
- [ ] **Refresh page** (F5)
- [ ] Go to /plans
- [ ] Verify:
  - Plan still exists
  - Recommendation still in "Done" column
  - Event count preserved
- [ ] Go to /evidence
- [ ] Verify:
  - Leaderboard stats unchanged
  - Recommendation still in list
  - Evidence details still available

### Clear and Reload
- [ ] Clear localStorage (DevTools → Application → Local Storage → Right-click → Clear)
- [ ] Refresh page
- [ ] Go to /plans
- [ ] Verify: "No Plans Yet" message displays
- [ ] Click "Load Sample Data"
- [ ] Verify: 3 plans load successfully

## 🧪 Test Suite 7: Edge Cases

### Disabled Button States
- [ ] On /results, verify "Start" is disabled until "Add to Plan" is clicked
- [ ] Verify "Mark Success" is disabled until "Start" is clicked
- [ ] Verify "Didn't Help" is disabled until "Start" is clicked
- [ ] Verify "Add to Plan" is disabled after clicking once

### Empty States
- [ ] Clear localStorage
- [ ] Go to /plans → See "No Plans Yet"
- [ ] Go to /evidence → See "No Evidence Yet"
- [ ] Go to /results without inputs → See "No Recommendations Found"

### Multiple Recommendations
- [ ] Load sample data on /inputs
- [ ] Generate recommendations
- [ ] Add 3 different recommendations to plan
- [ ] Verify all 3 appear on /plans in "Planned" column
- [ ] Start all 3
- [ ] Verify all move to "In Progress" column

### Plan Deletion
- [ ] On /plans, click trash icon on a plan
- [ ] Confirm deletion
- [ ] Plan is removed from list
- [ ] If was selected, another plan is auto-selected

## 📊 Expected Results Summary

### Sample Data Counts
- **Plans**: 3 (In Progress, Planned, Done)
- **Recommendations**: 5 total
  - Planned: 1
  - In Progress: 2
  - Done: 2
- **Events**: 23 total across all recommendations
- **Feedback**: 3 entries (quotes and success stories)
- **Snapshots**: 8 (baseline, checkpoint, final for various metrics)

### Evidence Scores (Approximate)
- **Recommendation 1** (Weekly actions):
  - Delta: +4.1, Coverage: 30%, Persistence: 80%
  - Evidence Score: ~0.98
- **Recommendation 2** (Assisted hours):
  - Delta: +1.0, Coverage: 40%, Persistence: 60%
  - Evidence Score: ~0.24

### Browser Compatibility
- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari (if on Mac)

## 🎯 Success Criteria

All tests should pass without errors. If any test fails:
1. Check browser console for errors
2. Verify localStorage is enabled
3. Ensure dev server is running
4. Try clearing localStorage and reloading sample data

## 📝 Notes

- Tests should be run in order (Suite 1 → Suite 7)
- Suite 5 (Complete Workflow) should be run as a standalone after clearing localStorage
- DevTools console should show telemetry events being logged
- No compilation errors should appear in terminal

---

**Testing Complete!** ✅

If all tests pass, the Plan-Execute-Evidence loop is working correctly and ready for use.
