# Coverage Tracking Guide

## 📊 What is Coverage?

**Coverage** measures the percentage of your target audience that you actually reached with your adoption intervention.

### Formula:
```
Coverage = (Total Users Reached) / (Total Audience Size)
```

### Why It Matters:
- **Evidence Score** = Delta × **Coverage** × Persistence
- Low coverage (0-30%) = weak proof the recommendation worked
- High coverage (70%+) = strong proof of impact
- Without coverage tracking, your Evidence Score will be artificially low or zero

---

## 🎯 How to Track Coverage

### Method 1: Log Activities (Recommended)

1. **Go to the Plans page** (`/plans`)
2. Find a recommendation in the **"In Progress"** column
3. Click the **"Log Activity"** button on the card
4. Enter your engagement data:
   - **Total Audience Size**: Total users who could potentially benefit (e.g., 1000)
   - **Outreach Sent**: Users who received emails/messages (e.g., 500)
   - **Event Attendees**: Users who attended kickoff events (e.g., 120)
   - **Learning Assigned**: Users assigned training/learning paths (e.g., 200)
5. Click **"Log Activities"**

**Example Calculation:**
```
Audience Size: 1000 users
Outreach: 500 users
Events: 120 attendees
Learning: 200 users

Total Reached = 500 + 120 + 200 = 820
Coverage = 820 / 1000 = 82%
```

### Method 2: Auto-Estimation (Fallback)

If you mark a recommendation as "Success" without logging activities, the system will:
- **Auto-estimate 30% coverage** (modest default)
- This assumes you tried the recommendation but didn't formally track activities

**When to use:**
- Quick testing or pilot programs
- Historical recommendations where activity data wasn't captured
- Small-scale initiatives without formal tracking

---

## ⚠️ Coverage Warnings

### Warning Indicators:

1. **Yellow ⚠️ Badge** (Evidence Page)
   - Appears on recommendations with coverage < 30%
   - Hover to see tooltip

2. **Warning Banner** (Evidence Details Modal)
   - Shows when coverage is low
   - Provides actionable tips
   - Links to Plans page for activity logging

### Warning Messages:

**0% Coverage:**
> "No engagement activities were tracked for this recommendation. The Evidence Score may not accurately reflect impact."

**1-29% Coverage:**
> "Only XX% coverage was achieved. Consider logging more engagement activities to strengthen evidence."

---

## 🚀 Best Practices

### 1. **Track Activities in Real-Time**
- Log outreach immediately after sending campaigns
- Record event attendance the same day
- Update learning assignments as they happen

### 2. **Be Realistic About Audience Size**
- Use actual user counts from your tenant
- Don't artificially inflate to make coverage look better
- Consistent audience sizing helps compare recommendations

### 3. **Track Multiple Activity Types**
- **Outreach**: Emails, Teams messages, Yammer posts
- **Events**: Kickoffs, training sessions, office hours
- **Learning**: Viva Learning paths, LinkedIn Learning, Copilot Academy

### 4. **Update Coverage as You Go**
- Don't wait until completion to log activities
- Multiple activity logs = better coverage tracking
- Shows progressive engagement over time

---

## 📈 Coverage Impact on Evidence Score

### Example Scenario: "Run Copilot Awareness Campaign"

#### With Proper Tracking:
```
Baseline: 42% active users
Final: 65% active users
Delta: +23 points (+55% improvement)

Activities Logged:
- Outreach: 500/1000 users
- Events: 120 attendees
- Learning: 200 users
Coverage = 82%

Persistence: 100% (sustained 30 days)

Evidence Score = 0.55 × 0.82 × 1.0 = 0.45 ⭐⭐⭐
```

#### Without Tracking (Auto-Estimated):
```
Same delta and persistence, but:
Coverage = 30% (auto-estimated)

Evidence Score = 0.55 × 0.30 × 1.0 = 0.17 ⭐
```

#### With Zero Tracking:
```
Same delta and persistence, but:
Coverage = 0% (no activities, marked success immediately)

Evidence Score = 0.55 × 0.00 × 1.0 = 0.00 ❌
```

**Result:** Proper tracking increased Evidence Score by **2.6x**!

---

## 🛠️ Technical Details

### Event Types Tracked:
1. **OUTREACH_SENT** - Email campaigns, messages
2. **EVENT_HELD** - Kickoffs, training sessions
3. **LEARNING_ASSIGNED** - Learning paths, courses

### Data Structure:
```typescript
track('OUTREACH_SENT', {
  planRecommendationId: 'rec-123',
  eventData: {
    count: 500,           // Users reached
    audienceSize: 1000,   // Total audience
    recordedBy: 'user@example.com'
  }
})
```

### Coverage Calculation Logic:
```typescript
// Sum all engagement across activity types
totalReached = sum(outreach.count, events.attendees, learning.users)
totalAudience = max(all event audience sizes)
coverage = min(totalReached / totalAudience, 1.0) // Cap at 100%

// Auto-estimation if no events
if (no_events && completed) {
  coverage = 0.30  // 30% default
} else if (no_events && not_completed) {
  coverage = 0.00  // 0% if not even completed
}
```

---

## 💡 Quick Tips

1. ✅ **Always log activities** for important recommendations
2. ✅ Use the Activity Log modal from Plans page
3. ✅ Track multiple activity types for better coverage
4. ✅ Update audience size consistently
5. ⚠️ Don't ignore coverage warnings
6. ⚠️ Don't mark success without capturing baseline/final values
7. ❌ Don't skip tracking for high-value initiatives

---

## 📚 Related Documentation

- [QUICK_START.md](./QUICK_START.md) - Getting started with the app
- [TESTING_CHECKLIST.md](./TESTING_CHECKLIST.md) - Complete testing guide
- [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md) - Technical deep dive
- [README.md](./README.md) - Full documentation

---

**Questions?** The system will show helpful warnings and tooltips when coverage is low!
