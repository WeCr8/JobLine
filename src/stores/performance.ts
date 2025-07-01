import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { 
  PerformanceMetrics, 
  Achievement, 
  TeamChallenge, 
  SkillDevelopment, 
  BonusStructure,
  InnovationSubmission,
  LeaderboardEntry,
  SeasonalEvent,
  MentorshipProgram,
  PerformanceInsight,
  CompanyPerformance
} from '../types/performance';

export const usePerformanceStore = defineStore('performance', () => {
  const userMetrics = ref<PerformanceMetrics | null>(null);
  const achievements = ref<Achievement[]>([]);
  const teamChallenges = ref<TeamChallenge[]>([]);
  const skillDevelopment = ref<SkillDevelopment[]>([]);
  const bonusStructures = ref<BonusStructure[]>([]);
  const innovations = ref<InnovationSubmission[]>([]);
  const leaderboard = ref<LeaderboardEntry[]>([]);
  const seasonalEvents = ref<SeasonalEvent[]>([]);
  const mentorships = ref<MentorshipProgram[]>([]);
  const insights = ref<PerformanceInsight[]>([]);
  const companyPerformance = ref<CompanyPerformance | null>(null);
  const loading = ref(false);

  // Mock data for demonstration
  const mockUserMetrics: PerformanceMetrics = {
    id: '1',
    userId: 'user-1',
    period: 'monthly',
    startDate: '2024-01-01',
    endDate: '2024-01-31',
    metrics: {
      efficiency: 92,
      quality: 96,
      safety: 100,
      productivity: 88,
      teamwork: 94,
      innovation: 85,
      attendance: 98,
      skillDevelopment: 90
    },
    goals: {
      efficiency: 85,
      quality: 95,
      safety: 100,
      productivity: 80,
      teamwork: 85,
      innovation: 75,
      attendance: 95,
      skillDevelopment: 80
    },
    achievements: [],
    totalScore: 93,
    rank: 3,
    bonusEarned: 2850,
    streaks: [
      {
        id: 'streak-1',
        type: 'quality',
        currentStreak: 15,
        bestStreak: 23,
        multiplier: 1.5,
        bonusPerDay: 25,
        isActive: true
      },
      {
        id: 'streak-2',
        type: 'safety',
        currentStreak: 45,
        bestStreak: 45,
        multiplier: 2.0,
        bonusPerDay: 50,
        isActive: true
      }
    ]
  };

  const mockAchievements: Achievement[] = [
    {
      id: 'ach-1',
      name: 'Quality Champion',
      description: 'Maintain 95%+ quality score for 30 consecutive days',
      category: 'quality',
      tier: 'gold',
      points: 500,
      bonusAmount: 250,
      icon: 'trophy',
      unlockedAt: '2024-01-15T10:30:00Z',
      requirements: [
        { metric: 'quality', operator: 'greater_than', value: 95, period: 'daily' },
        { metric: 'quality_streak', operator: 'greater_than', value: 30 }
      ],
      rarity: 'rare'
    },
    {
      id: 'ach-2',
      name: 'Innovation Catalyst',
      description: 'Submit 3 approved process improvements in one quarter',
      category: 'innovation',
      tier: 'platinum',
      points: 1000,
      bonusAmount: 500,
      icon: 'lightbulb',
      unlockedAt: '2024-01-20T14:15:00Z',
      requirements: [
        { metric: 'innovations_approved', operator: 'greater_than', value: 3, period: 'quarterly' }
      ],
      rarity: 'epic'
    },
    {
      id: 'ach-3',
      name: 'Safety Guardian',
      description: 'Zero safety incidents for 6 months',
      category: 'safety',
      tier: 'diamond',
      points: 2000,
      bonusAmount: 1000,
      icon: 'shield',
      unlockedAt: '2024-01-10T09:00:00Z',
      requirements: [
        { metric: 'safety_incidents', operator: 'equal_to', value: 0, period: 'monthly' },
        { metric: 'safety_streak', operator: 'greater_than', value: 180 }
      ],
      rarity: 'legendary'
    },
    {
      id: 'ach-4',
      name: 'Team Player',
      description: 'Receive 5+ peer nominations for teamwork in one month',
      category: 'teamwork',
      tier: 'silver',
      points: 300,
      bonusAmount: 150,
      icon: 'users',
      unlockedAt: '2024-01-25T16:45:00Z',
      requirements: [
        { metric: 'peer_nominations', operator: 'greater_than', value: 5, period: 'monthly' }
      ],
      rarity: 'uncommon'
    }
  ];

  const mockTeamChallenges: TeamChallenge[] = [
    {
      id: 'challenge-1',
      name: 'Efficiency Excellence',
      description: 'Department-wide challenge to improve overall efficiency by 10%',
      type: 'department',
      startDate: '2024-02-01',
      endDate: '2024-02-29',
      participants: ['user-1', 'user-2', 'user-3', 'user-4'],
      teams: [
        {
          id: 'team-1',
          name: 'CNC Warriors',
          members: ['user-1', 'user-2'],
          captain: 'user-1',
          score: 1250,
          rank: 1,
          color: '#3b82f6',
          avatar: '⚡'
        },
        {
          id: 'team-2',
          name: 'Quality Crusaders',
          members: ['user-3', 'user-4'],
          captain: 'user-3',
          score: 1180,
          rank: 2,
          color: '#10b981',
          avatar: '🛡️'
        }
      ],
      metrics: ['efficiency', 'quality', 'productivity'],
      rewards: [
        { rank: 1, bonusAmount: 500, points: 1000, badge: 'Champion', perks: ['Priority Parking', 'Catered Lunch'] },
        { rank: 2, bonusAmount: 300, points: 600, badge: 'Runner-up', perks: ['Gift Card'] },
        { rank: 3, bonusAmount: 150, points: 300, badge: 'Participant' }
      ],
      status: 'active',
      leaderboard: [
        {
          teamId: 'team-1',
          teamName: 'CNC Warriors',
          score: 1250,
          rank: 1,
          trend: 'up',
          members: ['user-1', 'user-2']
        },
        {
          teamId: 'team-2',
          teamName: 'Quality Crusaders',
          score: 1180,
          rank: 2,
          trend: 'stable',
          members: ['user-3', 'user-4']
        }
      ]
    }
  ];

  const mockBonusStructures: BonusStructure[] = [
    {
      id: 'bonus-1',
      name: 'Performance Excellence Bonus',
      type: 'performance',
      baseAmount: 100,
      multipliers: [
        { condition: 'score >= 90', multiplier: 2.0, description: 'Exceptional Performance' },
        { condition: 'score >= 85', multiplier: 1.5, description: 'High Performance' },
        { condition: 'score >= 80', multiplier: 1.2, description: 'Good Performance' }
      ],
      eligibility: {
        minTenure: 3,
        minPerformanceScore: 75
      },
      payoutSchedule: 'monthly',
      maxAmount: 1000,
      isActive: true
    },
    {
      id: 'bonus-2',
      name: 'Innovation Reward',
      type: 'innovation',
      baseAmount: 250,
      multipliers: [
        { condition: 'savings >= 10000', multiplier: 3.0, description: 'High Impact Innovation' },
        { condition: 'savings >= 5000', multiplier: 2.0, description: 'Medium Impact Innovation' },
        { condition: 'savings >= 1000', multiplier: 1.5, description: 'Low Impact Innovation' }
      ],
      eligibility: {
        minTenure: 1,
        minPerformanceScore: 70
      },
      payoutSchedule: 'immediate',
      isActive: true
    },
    {
      id: 'bonus-3',
      name: 'Skill Development Incentive',
      type: 'skill',
      baseAmount: 150,
      multipliers: [
        { condition: 'certifications >= 3', multiplier: 2.5, description: 'Multi-Certified Expert' },
        { condition: 'certifications >= 2', multiplier: 2.0, description: 'Certified Professional' },
        { condition: 'certifications >= 1', multiplier: 1.5, description: 'Certified Specialist' }
      ],
      eligibility: {
        minTenure: 6,
        minPerformanceScore: 75
      },
      payoutSchedule: 'quarterly',
      maxAmount: 750,
      isActive: true
    }
  ];

  const mockLeaderboard: LeaderboardEntry[] = [
    {
      userId: 'user-1',
      userName: 'Sarah Johnson',
      department: 'CNC Machining',
      role: 'Senior Operator',
      score: 96,
      rank: 1,
      previousRank: 2,
      trend: 'up',
      achievements: 12,
      streaks: 3,
      bonusEarned: 3250,
      level: 8
    },
    {
      userId: 'user-2',
      userName: 'Mike Wilson',
      department: 'Quality Control',
      role: 'Quality Inspector',
      score: 94,
      rank: 2,
      previousRank: 1,
      trend: 'down',
      achievements: 10,
      streaks: 2,
      bonusEarned: 2980,
      level: 7
    },
    {
      userId: 'user-3',
      userName: 'John Smith',
      department: 'CNC Machining',
      role: 'Operator',
      score: 93,
      rank: 3,
      previousRank: 3,
      trend: 'stable',
      achievements: 8,
      streaks: 4,
      bonusEarned: 2850,
      level: 6
    }
  ];

  const mockSeasonalEvents: SeasonalEvent[] = [
    {
      id: 'event-1',
      name: 'Winter Excellence Challenge',
      description: 'Special winter-themed challenges with holiday bonuses',
      theme: 'winter',
      startDate: '2024-12-01',
      endDate: '2024-12-31',
      specialChallenges: ['challenge-winter-1', 'challenge-winter-2'],
      bonusMultipliers: {
        'quality': 1.5,
        'teamwork': 2.0,
        'innovation': 1.8
      },
      exclusiveRewards: [
        {
          id: 'winter-ach-1',
          name: 'Winter Champion',
          description: 'Top performer during Winter Excellence Challenge',
          category: 'special',
          tier: 'diamond',
          points: 2500,
          bonusAmount: 1500,
          icon: 'snowflake',
          unlockedAt: '',
          requirements: [],
          rarity: 'legendary'
        }
      ],
      participationReward: 100,
      isActive: false
    }
  ];

  const mockInsights: PerformanceInsight[] = [
    {
      id: 'insight-1',
      userId: 'user-1',
      type: 'opportunity',
      title: 'Mentorship Opportunity',
      description: 'Your leadership skills are exceptional. Consider becoming a mentor to earn additional bonuses.',
      actionItems: [
        'Apply for mentorship program',
        'Complete mentor training course',
        'Select mentee from waiting list'
      ],
      potentialBonus: 500,
      priority: 'medium',
      category: 'leadership',
      generatedDate: '2024-01-15T10:00:00Z'
    },
    {
      id: 'insight-2',
      userId: 'user-1',
      type: 'strength',
      title: 'Quality Excellence',
      description: 'Your quality scores are consistently above target. Keep up the excellent work!',
      actionItems: [
        'Share best practices with team',
        'Document quality procedures',
        'Train new operators'
      ],
      potentialBonus: 200,
      priority: 'low',
      category: 'quality',
      generatedDate: '2024-01-20T14:30:00Z'
    }
  ];

  const fetchUserMetrics = async () => {
    loading.value = true;
    await new Promise(resolve => setTimeout(resolve, 800));
    userMetrics.value = mockUserMetrics;
    loading.value = false;
  };

  const fetchAchievements = async () => {
    loading.value = true;
    await new Promise(resolve => setTimeout(resolve, 600));
    achievements.value = mockAchievements;
    loading.value = false;
  };

  const fetchTeamChallenges = async () => {
    loading.value = true;
    await new Promise(resolve => setTimeout(resolve, 500));
    teamChallenges.value = mockTeamChallenges;
    loading.value = false;
  };

  const fetchBonusStructures = async () => {
    loading.value = true;
    await new Promise(resolve => setTimeout(resolve, 400));
    bonusStructures.value = mockBonusStructures;
    loading.value = false;
  };

  const fetchLeaderboard = async () => {
    loading.value = true;
    await new Promise(resolve => setTimeout(resolve, 700));
    leaderboard.value = mockLeaderboard;
    loading.value = false;
  };

  const fetchSeasonalEvents = async () => {
    loading.value = true;
    await new Promise(resolve => setTimeout(resolve, 300));
    seasonalEvents.value = mockSeasonalEvents;
    loading.value = false;
  };

  const fetchInsights = async () => {
    loading.value = true;
    await new Promise(resolve => setTimeout(resolve, 500));
    insights.value = mockInsights;
    loading.value = false;
  };

  const submitInnovation = async (innovation: Omit<InnovationSubmission, 'id' | 'submittedDate' | 'status' | 'votes'>) => {
    const newInnovation: InnovationSubmission = {
      ...innovation,
      id: Date.now().toString(),
      submittedDate: new Date().toISOString(),
      status: 'pending',
      votes: []
    };
    innovations.value.unshift(newInnovation);
  };

  const joinChallenge = async (challengeId: string, teamId: string) => {
    const challenge = teamChallenges.value.find(c => c.id === challengeId);
    if (challenge) {
      // Implementation would add user to team
      console.log('Joining challenge:', challengeId, 'team:', teamId);
    }
  };

  const calculateBonus = (metrics: PerformanceMetrics, bonusStructure: BonusStructure): number => {
    let bonus = bonusStructure.baseAmount;
    
    // Apply multipliers based on performance
    for (const multiplier of bonusStructure.multipliers) {
      if (evaluateCondition(multiplier.condition, metrics)) {
        bonus *= multiplier.multiplier;
        break; // Apply only the first matching multiplier
      }
    }
    
    // Apply streak bonuses
    metrics.streaks.forEach(streak => {
      if (streak.isActive) {
        bonus += streak.bonusPerDay * streak.currentStreak;
      }
    });
    
    // Cap at maximum if specified
    if (bonusStructure.maxAmount) {
      bonus = Math.min(bonus, bonusStructure.maxAmount);
    }
    
    return Math.round(bonus);
  };

  const evaluateCondition = (condition: string, metrics: PerformanceMetrics): boolean => {
    // Simple condition evaluation (would be more sophisticated in real implementation)
    if (condition.includes('score >=')) {
      const threshold = parseInt(condition.split('>=')[1].trim());
      return metrics.totalScore >= threshold;
    }
    return false;
  };

  // Computed properties
  const userLevel = computed(() => {
    if (!userMetrics.value) return 1;
    return Math.floor(userMetrics.value.totalScore / 10) + 1;
  });

  const nextLevelProgress = computed(() => {
    if (!userMetrics.value) return 0;
    const currentLevelMin = (userLevel.value - 1) * 10;
    const nextLevelMin = userLevel.value * 10;
    return ((userMetrics.value.totalScore - currentLevelMin) / (nextLevelMin - currentLevelMin)) * 100;
  });

  const totalBonusEarned = computed(() => {
    return userMetrics.value?.bonusEarned || 0;
  });

  const activeStreaks = computed(() => {
    return userMetrics.value?.streaks.filter(s => s.isActive) || [];
  });

  const recentAchievements = computed(() => {
    return achievements.value
      .sort((a, b) => new Date(b.unlockedAt).getTime() - new Date(a.unlockedAt).getTime())
      .slice(0, 5);
  });

  const activeChallenges = computed(() => {
    return teamChallenges.value.filter(c => c.status === 'active');
  });

  const upcomingChallenges = computed(() => {
    return teamChallenges.value.filter(c => c.status === 'upcoming');
  });

  const currentSeasonalEvent = computed(() => {
    const now = new Date();
    return seasonalEvents.value.find(event => {
      const start = new Date(event.startDate);
      const end = new Date(event.endDate);
      return now >= start && now <= end && event.isActive;
    });
  });

  const performanceGrade = computed(() => {
    if (!userMetrics.value) return 'F';
    const score = userMetrics.value.totalScore;
    if (score >= 95) return 'A+';
    if (score >= 90) return 'A';
    if (score >= 85) return 'B+';
    if (score >= 80) return 'B';
    if (score >= 75) return 'C+';
    if (score >= 70) return 'C';
    if (score >= 65) return 'D';
    return 'F';
  });

  return {
    userMetrics,
    achievements,
    teamChallenges,
    skillDevelopment,
    bonusStructures,
    innovations,
    leaderboard,
    seasonalEvents,
    mentorships,
    insights,
    companyPerformance,
    loading,
    userLevel,
    nextLevelProgress,
    totalBonusEarned,
    activeStreaks,
    recentAchievements,
    activeChallenges,
    upcomingChallenges,
    currentSeasonalEvent,
    performanceGrade,
    fetchUserMetrics,
    fetchAchievements,
    fetchTeamChallenges,
    fetchBonusStructures,
    fetchLeaderboard,
    fetchSeasonalEvents,
    fetchInsights,
    submitInnovation,
    joinChallenge,
    calculateBonus
  };
});