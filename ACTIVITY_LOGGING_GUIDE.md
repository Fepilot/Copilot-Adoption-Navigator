# How to Log Activities - User Guide

## 📍 Where to Find Activity Logging

You can log activities in **TWO** places:

### Option 1: Results Page (Easiest!) ⭐
1. Go to **Results page** after evaluating your inputs
2. Click **"Add to Plan"** on any recommendation
3. Click **"Start"** → Enter your baseline value
4. Click **"Log Activities"** button (purple button)
5. Modal opens with smart, recommendation-specific activities!

### Option 2: Plans Page
1. Go to **Plans page** (`/plans`)
2. Find recommendations in the "In Progress" column
3. Click **"Log Activity"** button on any card
4. Same modal opens!

---

## 🎯 What Activities to Log

The system automatically suggests **relevant activities** based on your recommendation type:

### 🔔 **Awareness Campaigns**
If your recommendation includes "awareness", "campaign", or "communicate":
- 📧 Emails Sent
- 💬 Teams Messages
- 🎯 Kickoff Event Attendees
- 👁️ Yammer/Viva Engage Views

**Example:** "Run a Copilot Awareness Campaign"
- Sent 500 emails
- Posted in 3 Teams channels (reached 300 users)
- Held kickoff event with 120 attendees
- Yammer post viewed by 450 users

---

### 📚 **Training & Learning**
If your recommendation includes "training", "learning", "course", or "academy":
- 📚 Learning Paths Assigned
- ✅ Training Completed
- 🎓 Office Hours Attendees
- 🏆 Certifications Earned

**Example:** "Launch Copilot Learning Academy"
- Assigned learning to 400 users
- 280 completed training
- 85 attended office hours
- 150 earned certifications

---

### ⭐ **Champions Programs**
If your recommendation includes "champion", "power user", "super user", or "advocate":
- ⭐ Champions Recruited
- 👥 1-on-1 Coaching Sessions
- 🤝 Peer Support Interactions
- 🎤 Showcase Event Attendees

**Example:** "Build a Champions Program"
- Recruited 25 champions
- Conducted 60 coaching sessions
- Champions helped 150 peers
- 95 attended showcase events

---

### 🎬 **Feature Adoption**
If your recommendation includes "feature", "copilot chat", "word", "excel", etc.:
- 🎬 Feature Demo Attendees
- 💡 Tips & Tricks Shared
- 📖 Use Case Guides Sent
- 🚀 Pilot/Early Adopters

**Example:** "Drive Word Copilot Feature Adoption"
- 200 attended demos
- Shared tips with 350 users
- Sent guides to 450 users
- 75 joined pilot program

---

### 👔 **Manager Engagement**
If your recommendation includes "manager", "leadership", "executive", or "sponsor":
- 👔 Manager Briefings
- 📊 Team Meetings with Copilot Topic
- 🧰 Manager Toolkits Sent
- 🎯 Teams with Copilot Goals

**Example:** "Activate Manager-Led Adoption"
- 45 managers attended briefings
- 180 users in teams discussing Copilot
- Sent toolkits to 45 managers
- 30 teams set adoption goals

---

### 🛠️ **Use Case Focused**
If your recommendation includes "use case", "scenario", or "workflow":
- 🛠️ Use Case Workshops
- 📝 Templates/Prompts Shared
- 📢 Success Stories Shared
- ⚡ Practice Sessions

**Example:** "Share Use Cases for Your Team"
- 150 attended hands-on workshops
- Shared prompt library with 400 users
- Distributed 500 success stories
- 100 joined practice sessions

---

### 🔧 **Generic Activities** (Default)
For any other recommendation:
- 📧 Outreach Sent (emails, messages)
- 🎯 Event Attendees
- 📚 Learning Assigned
- 🆘 Support/Help Provided

---

## 💡 How to Use "Load Sample Activities"

1. Open the Activity Log modal
2. Click the **purple "Load Sample Activities"** button
3. All fields auto-fill with realistic sample data
4. **Edit the numbers** to match your actual activities
5. Click "Log Activities"

**Why use samples?**
- See what realistic numbers look like
- Get a quick start without typing
- Understand the range of activities to track

---

## 📊 Understanding Coverage Calculation

### **Live Preview:**
As you enter activities, the modal shows a **green "Coverage Preview"** box with:
- **Coverage Percentage** (e.g., 82%)
- **Breakdown** of how it's calculated
- **Explanation** of why it matters

### **Formula:**
```
Total Touches = Sum of all activities
Estimated Unique Users = Total Touches × 70% (overlap factor)
Coverage = Unique Users ÷ Audience Size

Example:
Emails: 500
Events: 120
Learning: 200
Total Touches = 820
Unique Users = 820 × 0.7 = 574 (assumes 30% overlap)
Coverage = 574 ÷ 1000 = 57.4%
```

### **Why 70% Uniqueness Factor?**
- Users often engage through **multiple channels**
- Someone might receive email AND attend event
- 70% factor estimates unique individuals reached
- If only one activity type, 100% uniqueness assumed

---

## 🎯 Step-by-Step Workflow

### **Complete Example:**

1. **Add to Plan**
   - Go to Results page
   - Click "Add to Plan" on "Run Copilot Awareness Campaign"

2. **Start Recommendation**
   - Click "Start"
   - Enter baseline: `42` (current % active users)

3. **Log Activities** ⭐ NEW!
   - Click "Log Activities" (purple button)
   - Modal opens with 4 awareness-specific activities
   - Click "Load Sample Activities" to see examples
   - Enter your actual numbers:
     - Audience Size: `1000`
     - Emails Sent: `500`
     - Teams Messages: `300`
     - Event Attendees: `120`
     - Yammer Views: `450`
   - See preview: **82% Coverage** 🎉
   - Click "Log Activities"

4. **Mark Success**
   - After running campaign for 30 days
   - Click "Mark Success"
   - Enter final value: `65` (new % active users)

5. **View Evidence**
   - Go to Evidence page
   - See your recommendation with:
     - Delta: +23 points (+55%)
     - Coverage: 82% ✅
     - Evidence Score: 0.45 ⭐⭐⭐
   - No warning badges!

---

## ⚠️ Common Questions

### **Q: When should I log activities?**
**A:** Log activities as they happen, or all at once before marking success. Either works!

### **Q: What if I don't know exact numbers?**
**A:** Use "Load Sample Activities" to see realistic ranges, then adjust to your best estimate.

### **Q: Can I log activities multiple times?**
**A:** Yes! Each time you click "Log Activities", new events are added. Coverage accumulates.

### **Q: What if I skip logging activities?**
**A:** The system auto-estimates 30% coverage, but you'll see warning badges. Better to log actual data!

### **Q: How accurate do I need to be?**
**A:** Rough estimates are fine. Focus on order of magnitude (hundreds vs thousands).

### **Q: What counts as "audience size"?**
**A:** Total users who *could* benefit from this recommendation (e.g., all licensed Copilot users in your tenant).

---

## 🚀 Quick Tips

1. ✅ **Log activities immediately** after executing them
2. ✅ Use the **purple button** on Results page (easiest access)
3. ✅ Click **"Load Sample Activities"** to see examples first
4. ✅ Watch the **green Coverage Preview** update in real-time
5. ✅ Read the **explanation text** to understand why activities matter
6. ⚠️ Don't skip activity logging for important recommendations!
7. 📊 Higher coverage = stronger Evidence Score

---

## 📈 Impact on Evidence Score

### **Without Activity Logging:**
```
Coverage: 30% (auto-estimated) ⚠️
Evidence Score: 0.17
Result: Warning badges, weak proof
```

### **With Activity Logging:**
```
Coverage: 82% (tracked) ✅
Evidence Score: 0.45
Result: No warnings, strong proof!
```

**2.6x higher Evidence Score** just from tracking activities! 🎯

---

## 🎥 Visual Guide

### **Button Location:**
Results Page → Recommendation Card → Action Buttons:
1. Add to Plan (blue)
2. Start (green)
3. **Log Activities (purple)** ⭐ ← Click here!
4. Mark Success (green outline)
5. Didn't Help (red outline)
6. Feedback (gray)

### **Modal Features:**
- **Top:** Recommendation details
- **Purple banner:** "Load Sample Activities" button
- **Audience Size:** First input field
- **Activities:** 4-6 fields (recommendation-specific)
- **Green preview:** Live coverage calculation
- **Yellow tip:** Why coverage matters
- **Bottom:** Cancel / Log Activities buttons

---

**Need help?** The modal includes context-specific activity types and live coverage previews to guide you! 🎯
