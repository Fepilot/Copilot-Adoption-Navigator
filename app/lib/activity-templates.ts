/**
 * Activity Templates for different recommendation types
 * Provides specific activity types and sample data based on recommendation content
 */

export interface ActivityType {
  id: string
  label: string
  icon: string
  placeholder: string
  description: string
}

export interface ActivityTemplate {
  activities: ActivityType[]
  sampleData: {
    audienceSize: number
    activities: Record<string, number>
  }
  explanation: string
}

/**
 * Get activity template based on recommendation text
 */
export function getActivityTemplate(recommendation: string): ActivityTemplate {
  const recLower = recommendation.toLowerCase()
  
  // Awareness/Communication campaigns
  if (recLower.includes('awareness') || recLower.includes('campaign') || recLower.includes('communicate')) {
    return {
      activities: [
        { id: 'emailsSent', label: 'Emails Sent', icon: '📧', placeholder: 'e.g., 500', description: 'Users who received awareness emails' },
        { id: 'teamsMessages', label: 'Teams Messages', icon: '💬', placeholder: 'e.g., 300', description: 'Users reached via Teams announcements' },
        { id: 'eventAttendees', label: 'Kickoff Event Attendees', icon: '🎯', placeholder: 'e.g., 120', description: 'Users who attended launch event' },
        { id: 'yammerViews', label: 'Yammer/Viva Engage Views', icon: '👁️', placeholder: 'e.g., 450', description: 'Users who viewed posts' },
      ],
      sampleData: {
        audienceSize: 1000,
        activities: {
          emailsSent: 500,
          teamsMessages: 300,
          eventAttendees: 120,
          yammerViews: 450,
        },
      },
      explanation: 'Coverage = (Total users reached through any channel) / Total audience. If a user received both email and Teams message, count them once.',
    }
  }
  
  // Training/Learning initiatives
  if (recLower.includes('training') || recLower.includes('learning') || recLower.includes('course') || recLower.includes('academy')) {
    return {
      activities: [
        { id: 'learningAssigned', label: 'Learning Paths Assigned', icon: '📚', placeholder: 'e.g., 400', description: 'Users assigned Copilot learning paths' },
        { id: 'trainingCompleted', label: 'Training Completed', icon: '✅', placeholder: 'e.g., 280', description: 'Users who finished training' },
        { id: 'officeHoursAttendees', label: 'Office Hours Attendees', icon: '🎓', placeholder: 'e.g., 85', description: 'Users attending Q&A sessions' },
        { id: 'certifications', label: 'Certifications Earned', icon: '🏆', placeholder: 'e.g., 150', description: 'Users who got certified' },
      ],
      sampleData: {
        audienceSize: 800,
        activities: {
          learningAssigned: 400,
          trainingCompleted: 280,
          officeHoursAttendees: 85,
          certifications: 150,
        },
      },
      explanation: 'Coverage = (Unique users who engaged with learning) / Total audience. High completion rates show strong engagement.',
    }
  }
  
  // Champions/Power User programs
  if (recLower.includes('champion') || recLower.includes('power user') || recLower.includes('super user') || recLower.includes('advocate')) {
    return {
      activities: [
        { id: 'championsRecruited', label: 'Champions Recruited', icon: '⭐', placeholder: 'e.g., 25', description: 'Users who joined champions program' },
        { id: 'oneOnOneSessions', label: '1-on-1 Coaching Sessions', icon: '👥', placeholder: 'e.g., 60', description: 'Individual coaching provided' },
        { id: 'peerSupport', label: 'Peer Support Interactions', icon: '🤝', placeholder: 'e.g., 150', description: 'Users helped by champions' },
        { id: 'showcaseEvents', label: 'Showcase Event Attendees', icon: '🎤', placeholder: 'e.g., 95', description: 'Users attending demo sessions' },
      ],
      sampleData: {
        audienceSize: 500,
        activities: {
          championsRecruited: 25,
          oneOnOneSessions: 60,
          peerSupport: 150,
          showcaseEvents: 95,
        },
      },
      explanation: 'Coverage = (Champions + Users they helped) / Total audience. Champions create multiplier effect.',
    }
  }
  
  // Feature-specific adoption
  if (recLower.includes('feature') || recLower.includes('copilot chat') || recLower.includes('word') || recLower.includes('excel')) {
    return {
      activities: [
        { id: 'demoAttendees', label: 'Feature Demo Attendees', icon: '🎬', placeholder: 'e.g., 200', description: 'Users who attended demos' },
        { id: 'tipsShared', label: 'Tips & Tricks Shared', icon: '💡', placeholder: 'e.g., 350', description: 'Users who received tips' },
        { id: 'useCaseGuides', label: 'Use Case Guides Sent', icon: '📖', placeholder: 'e.g., 450', description: 'Users who got practical guides' },
        { id: 'pilotUsers', label: 'Pilot/Early Adopters', icon: '🚀', placeholder: 'e.g., 75', description: 'Users testing the feature' },
      ],
      sampleData: {
        audienceSize: 750,
        activities: {
          demoAttendees: 200,
          tipsShared: 350,
          useCaseGuides: 450,
          pilotUsers: 75,
        },
      },
      explanation: 'Coverage = (Users exposed to feature through any method) / Total audience. Multiple touchpoints increase adoption.',
    }
  }
  
  // Manager/Leadership engagement
  if (recLower.includes('manager') || recLower.includes('leadership') || recLower.includes('executive') || recLower.includes('sponsor')) {
    return {
      activities: [
        { id: 'managerBriefings', label: 'Manager Briefings', icon: '👔', placeholder: 'e.g., 45', description: 'Managers who attended briefings' },
        { id: 'teamMeetings', label: 'Team Meetings with Copilot Topic', icon: '📊', placeholder: 'e.g., 180', description: 'Users in teams discussing Copilot' },
        { id: 'managerToolkits', label: 'Manager Toolkits Sent', icon: '🧰', placeholder: 'e.g., 45', description: 'Managers with enablement materials' },
        { id: 'teamGoalsSet', label: 'Teams with Copilot Goals', icon: '🎯', placeholder: 'e.g., 30', description: 'Teams with adoption targets' },
      ],
      sampleData: {
        audienceSize: 600,
        activities: {
          managerBriefings: 45,
          teamMeetings: 180,
          managerToolkits: 45,
          teamGoalsSet: 30,
        },
      },
      explanation: 'Coverage = (Users whose managers are engaged) / Total audience. Manager activation drives team adoption.',
    }
  }
  
  // Use case focused
  if (recLower.includes('use case') || recLower.includes('scenario') || recLower.includes('workflow')) {
    return {
      activities: [
        { id: 'useCaseWorkshops', label: 'Use Case Workshops', icon: '🛠️', placeholder: 'e.g., 150', description: 'Users attending hands-on workshops' },
        { id: 'templatesShared', label: 'Templates/Prompts Shared', icon: '📝', placeholder: 'e.g., 400', description: 'Users who got prompt libraries' },
        { id: 'successStories', label: 'Success Stories Shared', icon: '📢', placeholder: 'e.g., 500', description: 'Users who saw peer examples' },
        { id: 'practiceSessions', label: 'Practice Sessions', icon: '⚡', placeholder: 'e.g., 100', description: 'Users in guided practice' },
      ],
      sampleData: {
        audienceSize: 850,
        activities: {
          useCaseWorkshops: 150,
          templatesShared: 400,
          successStories: 500,
          practiceSessions: 100,
        },
      },
      explanation: 'Coverage = (Users exposed to practical use cases) / Total audience. Real examples accelerate adoption.',
    }
  }
  
  // Default/Generic activities
  return {
    activities: [
      { id: 'outreachSent', label: 'Outreach Sent (emails, messages)', icon: '📧', placeholder: 'e.g., 500', description: 'Users who received communications' },
      { id: 'eventAttendees', label: 'Event Attendees', icon: '🎯', placeholder: 'e.g., 120', description: 'Users who attended events' },
      { id: 'learningAssigned', label: 'Learning Assigned', icon: '📚', placeholder: 'e.g., 200', description: 'Users assigned learning resources' },
      { id: 'supportProvided', label: 'Support/Help Provided', icon: '🆘', placeholder: 'e.g., 80', description: 'Users who received direct help' },
    ],
    sampleData: {
      audienceSize: 1000,
      activities: {
        outreachSent: 500,
        eventAttendees: 120,
        learningAssigned: 200,
        supportProvided: 80,
      },
    },
    explanation: 'Coverage = (Unique users reached through activities) / Total audience. Track all engagement touchpoints.',
  }
}

/**
 * Calculate coverage percentage from activity data
 */
export function calculateCoverageFromActivities(
  activities: Record<string, number>,
  audienceSize: number
): { coverage: number; breakdown: string; totalReached: number } {
  // Sum all unique users reached (assuming some overlap)
  const activityValues = Object.values(activities).filter(v => v > 0)
  
  if (activityValues.length === 0) {
    return {
      coverage: 0,
      breakdown: 'No activities logged yet.',
      totalReached: 0,
    }
  }
  
  // Sum all activities (note: this may count same user multiple times)
  const totalTouches = activityValues.reduce((sum, val) => sum + val, 0)
  
  // Estimate unique users (apply overlap factor: ~70% unique if multiple channels)
  const overlapFactor = activityValues.length > 1 ? 0.7 : 1.0
  const estimatedUniqueUsers = Math.round(totalTouches * overlapFactor)
  
  const coverage = audienceSize > 0 ? Math.min(estimatedUniqueUsers / audienceSize, 1.0) : 0
  
  // Create breakdown text
  const activityNames = Object.keys(activities).filter(k => activities[k] > 0)
  const breakdown = `
Total touches: ${totalTouches.toLocaleString()}
Estimated unique users: ${estimatedUniqueUsers.toLocaleString()} (${(overlapFactor * 100).toFixed(0)}% uniqueness factor)
Audience size: ${audienceSize.toLocaleString()}
Coverage: ${(coverage * 100).toFixed(1)}%

Calculation: ${estimatedUniqueUsers.toLocaleString()} unique users ÷ ${audienceSize.toLocaleString()} audience = ${(coverage * 100).toFixed(1)}%
  `.trim()
  
  return {
    coverage,
    breakdown,
    totalReached: estimatedUniqueUsers,
  }
}
