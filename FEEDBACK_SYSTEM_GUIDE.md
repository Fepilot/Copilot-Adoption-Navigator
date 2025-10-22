# Feedback System User Guide

## Overview

The **Copilot Adoption Navigator** now includes a comprehensive feedback collection system to help you gather team input, track feature requests, and plan your product roadmap.

---

## 🎯 Three Ways to Collect Feedback

### 1. **Floating Feedback Widget** (Live Demo Feedback)
A purple chat button appears in the bottom-right corner of every page.

**How to Use:**
- Click the purple **chat button** (💬) at the bottom-right
- Fill out the feedback form:
  - **Category**: Bug, Feature Request, Improvement, UI/UX, Performance, Documentation, or General
  - **Priority**: Low, Medium, High, or Critical
  - **Title**: Brief summary (100 characters max)
  - **Description**: Detailed explanation (1000 characters max)
  - **Tags**: Optional keywords (comma-separated)
  - **Your Name**: Optional (defaults to "Anonymous")
- Click **Submit Feedback**
- See success confirmation

**Best For:**
- During live presentations to your team
- Real-time feedback while testing features
- Quick bug reports or feature ideas

**Auto-Captured:**
- Current page context (Landing, Inputs, Results, Plans, Evidence)
- Timestamp

---

### 2. **Feedback Dashboard** (Review & Manage)
Access the full feedback management interface.

**How to Access:**
- Click **"Feedback Dashboard"** button in the landing page header
- Or navigate directly to `/feedback-dashboard`

**Features:**
- **View All Feedback**: See every submission in one place
- **Filter & Search**:
  - Search by title, description, or tags
  - Filter by Category, Status, Priority, or Page
- **Update Status**: Move feedback through workflow stages
  - Submitted → Reviewing → Planned → In Progress → Completed → Won't Fix
- **Upvote**: Click thumbs-up to vote on important feedback
- **Export CSV**: Download filtered feedback for sharing

**Dashboard Stats:**
- Total Feedback count
- Total Votes
- Completed items
- Awaiting Review count

**Detail View:**
- Click any feedback card to open details
- Update status with one click
- See full description, tags, and metadata
- View submission info (who, when, page)

---

### 3. **Screenshot Gallery** (Coming Soon)
Pre-captured screenshots with annotation hotspots for async review.

*Note: This feature is planned but not yet implemented.*

---

## 📊 Feedback Workflow

```
Submitted → Reviewing → Planned → In Progress → Completed
                                              ↓
                                          Won't Fix
```

**Status Definitions:**
- **Submitted**: New feedback, not yet reviewed
- **Reviewing**: Team is evaluating feasibility
- **Planned**: Approved for future development
- **In Progress**: Currently being worked on
- **Completed**: Implemented and deployed
- **Won't Fix**: Decided not to implement

---

## 🎨 Feedback Categories

| Category | Icon | Use For |
|----------|------|---------|
| Bug | 🐛 | Errors, crashes, unexpected behavior |
| Feature Request | ✨ | New capabilities or enhancements |
| Improvement | 📈 | Optimizations to existing features |
| UI/UX | 🎨 | Design, layout, or usability issues |
| Performance | ⚡ | Speed, load times, responsiveness |
| Documentation | 📚 | Help text, guides, tutorials |
| General | 💬 | Everything else |

---

## 🔢 Priority Levels

- **Low**: Nice to have, not urgent
- **Medium**: Important but not blocking
- **High**: Significant impact, should address soon
- **Critical**: Blocking issue, needs immediate attention

---

## 💾 Data Storage

All feedback is stored in **browser localStorage** (client-side).

**Persistence:**
- ✅ Data survives page refreshes
- ✅ Data persists across browser sessions
- ⚠️ Data is browser-specific (not synced across devices)
- ⚠️ Data is user-specific (not shared between team members)

**Important Notes:**
- Clearing browser cache will delete feedback data
- For team collaboration, export feedback to CSV and share with stakeholders
- Consider copying feedback to a shared tool (Jira, Azure DevOps, etc.) for permanent storage

---

## 📥 Exporting Feedback

**From the Dashboard:**
1. Apply filters if needed (category, status, priority, page)
2. Click **"Export CSV"** button in the top-right
3. File downloads as `feedback-export-YYYY-MM-DD.csv`

**CSV Includes:**
- ID, Title, Description
- Category, Priority, Status
- Page, Submitted By, Submitted At
- Votes, Tags
- Assigned To, Target Release, Notes

**Use Exported Data For:**
- Sharing with product team
- Importing to project management tools
- Roadmap planning sessions
- Stakeholder reporting

---

## 🎯 Recommended Workflow for Team Presentations

### During Presentation (30 min)
1. **Introduction (5 min)**: Show the app features
2. **Demo (15 min)**: Walk through Inputs → Results → Plans → Evidence flow
3. **Hands-On (10 min)**: Let team explore and submit feedback using the floating widget

### After Presentation
4. **Review Feedback**: Open Feedback Dashboard
5. **Triage**: Update status (Reviewing, Planned, Won't Fix)
6. **Prioritize**: Upvote critical items
7. **Export**: Download CSV for documentation
8. **Plan**: Add high-priority items to development roadmap

---

## 🎬 Quick Actions

### To Submit Feedback:
1. Click purple chat button (bottom-right)
2. Select category and priority
3. Enter title and description
4. Click "Submit Feedback"

### To Review Feedback:
1. Go to Landing page
2. Click "Feedback Dashboard" in header
3. Filter by status/category/priority
4. Click feedback cards to view details

### To Export Feedback:
1. Open Feedback Dashboard
2. Apply filters (optional)
3. Click "Export CSV" button

---

## 🔗 Navigation

- **Landing Page**: Click "Feedback Dashboard" button in header
- **Feedback Dashboard**: `/feedback-dashboard` (direct URL)
- **Floating Widget**: Available on every page (bottom-right corner)

---

## 📈 Roadmap Planning

Use feedback data to inform your roadmap:

1. **Identify Trends**: Look for common themes across feedback
2. **Prioritize by Votes**: High-voted items = high user demand
3. **Group by Category**: Focus on bugs first, then features
4. **Set Timelines**: Move planned items to "In Progress" when starting work
5. **Communicate**: Export and share progress with stakeholders

---

## ❓ FAQ

**Q: Can multiple people submit feedback?**  
A: Yes! Each person's feedback is stored in their browser. Export and combine CSV files to aggregate team input.

**Q: Is feedback anonymous?**  
A: By default, yes. Users can optionally enter their name in the "Your Name" field.

**Q: Can I delete feedback?**  
A: Not through the UI currently. To clear all feedback, you can clear browser localStorage.

**Q: What happens if I clear my browser cache?**  
A: All feedback will be deleted. Always export important feedback to CSV before clearing cache.

**Q: Can I edit submitted feedback?**  
A: Currently, you can only update the status. To edit content, you'd need to submit new feedback.

---

## 🚀 Future Enhancements (Planned)

- [ ] Screenshot Gallery with annotation hotspots
- [ ] Edit existing feedback
- [ ] Delete individual feedback items
- [ ] Server-side storage for team collaboration
- [ ] Email notifications for new feedback
- [ ] Integration with Azure DevOps / Jira
- [ ] Excel export with roadmap templates
- [ ] Feedback analytics dashboard

---

## 📞 Support

For questions or issues with the feedback system, submit feedback using the widget (meta, right? 😄) with category "General" or "Bug".

