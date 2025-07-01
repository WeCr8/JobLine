export interface PerformanceMetrics {
    id: string;
    userId: string;
    period: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
    startDate: string;
    endDate: string;
    metrics: {
        efficiency: number;
        quality: number;
        safety: number;
        productivity: number;
        teamwork: number;
        innovation: number;
        attendance: number;
        skillDevelopment: number;
    };
    goals: {
        efficiency: number;
        quality: number;
        safety: number;
        productivity: number;
        teamwork: number;
        innovation: number;
        attendance: number;
        skillDevelopment: number;
    };
    achievements: Achievement[];
    totalScore: number;
    rank: number;
    bonusEarned: number;
    streaks: PerformanceStreak[];
}
export interface Achievement {
    id: string;
    name: string;
    description: string;
    category: AchievementCategory;
    tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
    points: number;
    bonusAmount: number;
    icon: string;
    unlockedAt: string;
    requirements: AchievementRequirement[];
    rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
}
export interface AchievementRequirement {
    metric: string;
    operator: 'greater_than' | 'less_than' | 'equal_to' | 'streak';
    value: number;
    period?: string;
}
export interface PerformanceStreak {
    id: string;
    type: 'efficiency' | 'quality' | 'safety' | 'attendance' | 'innovation';
    currentStreak: number;
    bestStreak: number;
    multiplier: number;
    bonusPerDay: number;
    isActive: boolean;
}
export interface TeamChallenge {
    id: string;
    name: string;
    description: string;
    type: 'department' | 'shift' | 'machine' | 'skill-level' | 'cross-functional';
    startDate: string;
    endDate: string;
    participants: string[];
    teams: ChallengeTeam[];
    metrics: string[];
    rewards: ChallengeReward[];
    status: 'upcoming' | 'active' | 'completed' | 'cancelled';
    leaderboard: TeamLeaderboardEntry[];
}
export interface ChallengeTeam {
    id: string;
    name: string;
    members: string[];
    captain: string;
    score: number;
    rank: number;
    color: string;
    avatar: string;
}
export interface ChallengeReward {
    rank: number;
    bonusAmount: number;
    points: number;
    badge?: string;
    perks?: string[];
}
export interface TeamLeaderboardEntry {
    teamId: string;
    teamName: string;
    score: number;
    rank: number;
    trend: 'up' | 'down' | 'stable';
    members: string[];
}
export interface SkillDevelopment {
    id: string;
    userId: string;
    skillName: string;
    category: SkillCategory;
    currentLevel: number;
    maxLevel: number;
    experience: number;
    experienceToNext: number;
    certifications: Certification[];
    trainingCompleted: TrainingModule[];
    mentorshipHours: number;
    teachingHours: number;
    bonusMultiplier: number;
}
export interface Certification {
    id: string;
    name: string;
    issuer: string;
    earnedDate: string;
    expiryDate?: string;
    level: 'basic' | 'intermediate' | 'advanced' | 'expert' | 'master';
    bonusAmount: number;
    skillPoints: number;
}
export interface TrainingModule {
    id: string;
    name: string;
    category: string;
    duration: number;
    completedDate: string;
    score: number;
    bonusEarned: number;
    skillPointsEarned: number;
}
export interface BonusStructure {
    id: string;
    name: string;
    type: 'performance' | 'achievement' | 'streak' | 'team' | 'skill' | 'innovation';
    baseAmount: number;
    multipliers: BonusMultiplier[];
    eligibility: BonusEligibility;
    payoutSchedule: 'immediate' | 'weekly' | 'monthly' | 'quarterly';
    maxAmount?: number;
    isActive: boolean;
}
export interface BonusMultiplier {
    condition: string;
    multiplier: number;
    description: string;
}
export interface BonusEligibility {
    minTenure: number;
    minPerformanceScore: number;
    requiredCertifications?: string[];
    excludedRoles?: string[];
}
export interface InnovationSubmission {
    id: string;
    userId: string;
    title: string;
    description: string;
    category: 'process-improvement' | 'cost-reduction' | 'safety-enhancement' | 'quality-improvement' | 'efficiency-boost';
    submittedDate: string;
    status: 'pending' | 'under-review' | 'approved' | 'implemented' | 'rejected';
    reviewers: string[];
    estimatedSavings: number;
    actualSavings?: number;
    implementationDate?: string;
    bonusAwarded: number;
    recognitionLevel: 'department' | 'company' | 'industry';
    attachments: string[];
    votes: InnovationVote[];
}
export interface InnovationVote {
    userId: string;
    vote: 'up' | 'down';
    comment?: string;
    timestamp: string;
}
export interface LeaderboardEntry {
    userId: string;
    userName: string;
    department: string;
    role: string;
    score: number;
    rank: number;
    previousRank: number;
    trend: 'up' | 'down' | 'stable';
    achievements: number;
    streaks: number;
    bonusEarned: number;
    avatar?: string;
    level: number;
}
export interface SeasonalEvent {
    id: string;
    name: string;
    description: string;
    theme: string;
    startDate: string;
    endDate: string;
    specialChallenges: string[];
    bonusMultipliers: Record<string, number>;
    exclusiveRewards: Achievement[];
    participationReward: number;
    isActive: boolean;
}
export interface MentorshipProgram {
    id: string;
    mentorId: string;
    menteeId: string;
    skillFocus: string[];
    startDate: string;
    duration: number;
    sessionsCompleted: number;
    targetSessions: number;
    mentorBonus: number;
    menteeBonus: number;
    progressMilestones: MentorshipMilestone[];
    status: 'active' | 'completed' | 'paused' | 'cancelled';
}
export interface MentorshipMilestone {
    id: string;
    name: string;
    description: string;
    targetDate: string;
    completedDate?: string;
    bonusAmount: number;
    isCompleted: boolean;
}
export type AchievementCategory = 'efficiency' | 'quality' | 'safety' | 'teamwork' | 'innovation' | 'learning' | 'leadership' | 'attendance' | 'milestone' | 'special';
export type SkillCategory = 'technical' | 'safety' | 'quality' | 'leadership' | 'communication' | 'problem-solving' | 'innovation' | 'teamwork';
export interface PerformanceInsight {
    id: string;
    userId: string;
    type: 'strength' | 'improvement' | 'opportunity' | 'risk';
    title: string;
    description: string;
    actionItems: string[];
    potentialBonus: number;
    priority: 'low' | 'medium' | 'high' | 'critical';
    category: string;
    generatedDate: string;
}
export interface CompanyPerformance {
    period: string;
    totalRevenue: number;
    profitMargin: number;
    bonusPool: number;
    distributedBonuses: number;
    participationRate: number;
    averagePerformanceScore: number;
    topPerformers: string[];
    departmentRankings: DepartmentRanking[];
}
export interface DepartmentRanking {
    departmentId: string;
    departmentName: string;
    averageScore: number;
    rank: number;
    bonusMultiplier: number;
    topPerformer: string;
}
