import type { PerformanceMetrics, Achievement, TeamChallenge, SkillDevelopment, BonusStructure, InnovationSubmission, LeaderboardEntry, SeasonalEvent, MentorshipProgram, PerformanceInsight, CompanyPerformance } from '../types/performance';
export declare const usePerformanceStore: import("pinia").StoreDefinition<"performance", Pick<{
    userMetrics: import("vue").Ref<{
        id: string;
        userId: string;
        period: "daily" | "weekly" | "monthly" | "quarterly" | "yearly";
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
        achievements: {
            id: string;
            name: string;
            description: string;
            category: import("../types/performance").AchievementCategory;
            tier: "bronze" | "silver" | "gold" | "platinum" | "diamond";
            points: number;
            bonusAmount: number;
            icon: string;
            unlockedAt: string;
            requirements: {
                metric: string;
                operator: "greater_than" | "less_than" | "equal_to" | "streak";
                value: number;
                period?: string | undefined;
            }[];
            rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
        }[];
        totalScore: number;
        rank: number;
        bonusEarned: number;
        streaks: {
            id: string;
            type: "efficiency" | "quality" | "safety" | "attendance" | "innovation";
            currentStreak: number;
            bestStreak: number;
            multiplier: number;
            bonusPerDay: number;
            isActive: boolean;
        }[];
    } | null, PerformanceMetrics | {
        id: string;
        userId: string;
        period: "daily" | "weekly" | "monthly" | "quarterly" | "yearly";
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
        achievements: {
            id: string;
            name: string;
            description: string;
            category: import("../types/performance").AchievementCategory;
            tier: "bronze" | "silver" | "gold" | "platinum" | "diamond";
            points: number;
            bonusAmount: number;
            icon: string;
            unlockedAt: string;
            requirements: {
                metric: string;
                operator: "greater_than" | "less_than" | "equal_to" | "streak";
                value: number;
                period?: string | undefined;
            }[];
            rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
        }[];
        totalScore: number;
        rank: number;
        bonusEarned: number;
        streaks: {
            id: string;
            type: "efficiency" | "quality" | "safety" | "attendance" | "innovation";
            currentStreak: number;
            bestStreak: number;
            multiplier: number;
            bonusPerDay: number;
            isActive: boolean;
        }[];
    } | null>;
    achievements: import("vue").Ref<{
        id: string;
        name: string;
        description: string;
        category: import("../types/performance").AchievementCategory;
        tier: "bronze" | "silver" | "gold" | "platinum" | "diamond";
        points: number;
        bonusAmount: number;
        icon: string;
        unlockedAt: string;
        requirements: {
            metric: string;
            operator: "greater_than" | "less_than" | "equal_to" | "streak";
            value: number;
            period?: string | undefined;
        }[];
        rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
    }[], Achievement[] | {
        id: string;
        name: string;
        description: string;
        category: import("../types/performance").AchievementCategory;
        tier: "bronze" | "silver" | "gold" | "platinum" | "diamond";
        points: number;
        bonusAmount: number;
        icon: string;
        unlockedAt: string;
        requirements: {
            metric: string;
            operator: "greater_than" | "less_than" | "equal_to" | "streak";
            value: number;
            period?: string | undefined;
        }[];
        rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
    }[]>;
    teamChallenges: import("vue").Ref<{
        id: string;
        name: string;
        description: string;
        type: "department" | "shift" | "machine" | "skill-level" | "cross-functional";
        startDate: string;
        endDate: string;
        participants: string[];
        teams: {
            id: string;
            name: string;
            members: string[];
            captain: string;
            score: number;
            rank: number;
            color: string;
            avatar: string;
        }[];
        metrics: string[];
        rewards: {
            rank: number;
            bonusAmount: number;
            points: number;
            badge?: string | undefined;
            perks?: string[] | undefined;
        }[];
        status: "upcoming" | "active" | "completed" | "cancelled";
        leaderboard: {
            teamId: string;
            teamName: string;
            score: number;
            rank: number;
            trend: "up" | "down" | "stable";
            members: string[];
        }[];
    }[], TeamChallenge[] | {
        id: string;
        name: string;
        description: string;
        type: "department" | "shift" | "machine" | "skill-level" | "cross-functional";
        startDate: string;
        endDate: string;
        participants: string[];
        teams: {
            id: string;
            name: string;
            members: string[];
            captain: string;
            score: number;
            rank: number;
            color: string;
            avatar: string;
        }[];
        metrics: string[];
        rewards: {
            rank: number;
            bonusAmount: number;
            points: number;
            badge?: string | undefined;
            perks?: string[] | undefined;
        }[];
        status: "upcoming" | "active" | "completed" | "cancelled";
        leaderboard: {
            teamId: string;
            teamName: string;
            score: number;
            rank: number;
            trend: "up" | "down" | "stable";
            members: string[];
        }[];
    }[]>;
    skillDevelopment: import("vue").Ref<{
        id: string;
        userId: string;
        skillName: string;
        category: import("../types/performance").SkillCategory;
        currentLevel: number;
        maxLevel: number;
        experience: number;
        experienceToNext: number;
        certifications: {
            id: string;
            name: string;
            issuer: string;
            earnedDate: string;
            expiryDate?: string | undefined;
            level: "basic" | "intermediate" | "advanced" | "expert" | "master";
            bonusAmount: number;
            skillPoints: number;
        }[];
        trainingCompleted: {
            id: string;
            name: string;
            category: string;
            duration: number;
            completedDate: string;
            score: number;
            bonusEarned: number;
            skillPointsEarned: number;
        }[];
        mentorshipHours: number;
        teachingHours: number;
        bonusMultiplier: number;
    }[], SkillDevelopment[] | {
        id: string;
        userId: string;
        skillName: string;
        category: import("../types/performance").SkillCategory;
        currentLevel: number;
        maxLevel: number;
        experience: number;
        experienceToNext: number;
        certifications: {
            id: string;
            name: string;
            issuer: string;
            earnedDate: string;
            expiryDate?: string | undefined;
            level: "basic" | "intermediate" | "advanced" | "expert" | "master";
            bonusAmount: number;
            skillPoints: number;
        }[];
        trainingCompleted: {
            id: string;
            name: string;
            category: string;
            duration: number;
            completedDate: string;
            score: number;
            bonusEarned: number;
            skillPointsEarned: number;
        }[];
        mentorshipHours: number;
        teachingHours: number;
        bonusMultiplier: number;
    }[]>;
    bonusStructures: import("vue").Ref<{
        id: string;
        name: string;
        type: "performance" | "innovation" | "streak" | "achievement" | "team" | "skill";
        baseAmount: number;
        multipliers: {
            condition: string;
            multiplier: number;
            description: string;
        }[];
        eligibility: {
            minTenure: number;
            minPerformanceScore: number;
            requiredCertifications?: string[] | undefined;
            excludedRoles?: string[] | undefined;
        };
        payoutSchedule: "weekly" | "monthly" | "quarterly" | "immediate";
        maxAmount?: number | undefined;
        isActive: boolean;
    }[], BonusStructure[] | {
        id: string;
        name: string;
        type: "performance" | "innovation" | "streak" | "achievement" | "team" | "skill";
        baseAmount: number;
        multipliers: {
            condition: string;
            multiplier: number;
            description: string;
        }[];
        eligibility: {
            minTenure: number;
            minPerformanceScore: number;
            requiredCertifications?: string[] | undefined;
            excludedRoles?: string[] | undefined;
        };
        payoutSchedule: "weekly" | "monthly" | "quarterly" | "immediate";
        maxAmount?: number | undefined;
        isActive: boolean;
    }[]>;
    innovations: import("vue").Ref<{
        id: string;
        userId: string;
        title: string;
        description: string;
        category: "process-improvement" | "cost-reduction" | "safety-enhancement" | "quality-improvement" | "efficiency-boost";
        submittedDate: string;
        status: "pending" | "under-review" | "approved" | "rejected" | "implemented";
        reviewers: string[];
        estimatedSavings: number;
        actualSavings?: number | undefined;
        implementationDate?: string | undefined;
        bonusAwarded: number;
        recognitionLevel: "department" | "industry" | "company";
        attachments: string[];
        votes: {
            userId: string;
            vote: "up" | "down";
            comment?: string | undefined;
            timestamp: string;
        }[];
    }[], InnovationSubmission[] | {
        id: string;
        userId: string;
        title: string;
        description: string;
        category: "process-improvement" | "cost-reduction" | "safety-enhancement" | "quality-improvement" | "efficiency-boost";
        submittedDate: string;
        status: "pending" | "under-review" | "approved" | "rejected" | "implemented";
        reviewers: string[];
        estimatedSavings: number;
        actualSavings?: number | undefined;
        implementationDate?: string | undefined;
        bonusAwarded: number;
        recognitionLevel: "department" | "industry" | "company";
        attachments: string[];
        votes: {
            userId: string;
            vote: "up" | "down";
            comment?: string | undefined;
            timestamp: string;
        }[];
    }[]>;
    leaderboard: import("vue").Ref<{
        userId: string;
        userName: string;
        department: string;
        role: string;
        score: number;
        rank: number;
        previousRank: number;
        trend: "up" | "down" | "stable";
        achievements: number;
        streaks: number;
        bonusEarned: number;
        avatar?: string | undefined;
        level: number;
    }[], LeaderboardEntry[] | {
        userId: string;
        userName: string;
        department: string;
        role: string;
        score: number;
        rank: number;
        previousRank: number;
        trend: "up" | "down" | "stable";
        achievements: number;
        streaks: number;
        bonusEarned: number;
        avatar?: string | undefined;
        level: number;
    }[]>;
    seasonalEvents: import("vue").Ref<{
        id: string;
        name: string;
        description: string;
        theme: string;
        startDate: string;
        endDate: string;
        specialChallenges: string[];
        bonusMultipliers: Record<string, number>;
        exclusiveRewards: {
            id: string;
            name: string;
            description: string;
            category: import("../types/performance").AchievementCategory;
            tier: "bronze" | "silver" | "gold" | "platinum" | "diamond";
            points: number;
            bonusAmount: number;
            icon: string;
            unlockedAt: string;
            requirements: {
                metric: string;
                operator: "greater_than" | "less_than" | "equal_to" | "streak";
                value: number;
                period?: string | undefined;
            }[];
            rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
        }[];
        participationReward: number;
        isActive: boolean;
    }[], SeasonalEvent[] | {
        id: string;
        name: string;
        description: string;
        theme: string;
        startDate: string;
        endDate: string;
        specialChallenges: string[];
        bonusMultipliers: Record<string, number>;
        exclusiveRewards: {
            id: string;
            name: string;
            description: string;
            category: import("../types/performance").AchievementCategory;
            tier: "bronze" | "silver" | "gold" | "platinum" | "diamond";
            points: number;
            bonusAmount: number;
            icon: string;
            unlockedAt: string;
            requirements: {
                metric: string;
                operator: "greater_than" | "less_than" | "equal_to" | "streak";
                value: number;
                period?: string | undefined;
            }[];
            rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
        }[];
        participationReward: number;
        isActive: boolean;
    }[]>;
    mentorships: import("vue").Ref<{
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
        progressMilestones: {
            id: string;
            name: string;
            description: string;
            targetDate: string;
            completedDate?: string | undefined;
            bonusAmount: number;
            isCompleted: boolean;
        }[];
        status: "active" | "completed" | "cancelled" | "paused";
    }[], MentorshipProgram[] | {
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
        progressMilestones: {
            id: string;
            name: string;
            description: string;
            targetDate: string;
            completedDate?: string | undefined;
            bonusAmount: number;
            isCompleted: boolean;
        }[];
        status: "active" | "completed" | "cancelled" | "paused";
    }[]>;
    insights: import("vue").Ref<{
        id: string;
        userId: string;
        type: "strength" | "improvement" | "opportunity" | "risk";
        title: string;
        description: string;
        actionItems: string[];
        potentialBonus: number;
        priority: "critical" | "low" | "medium" | "high";
        category: string;
        generatedDate: string;
    }[], PerformanceInsight[] | {
        id: string;
        userId: string;
        type: "strength" | "improvement" | "opportunity" | "risk";
        title: string;
        description: string;
        actionItems: string[];
        potentialBonus: number;
        priority: "critical" | "low" | "medium" | "high";
        category: string;
        generatedDate: string;
    }[]>;
    companyPerformance: import("vue").Ref<{
        period: string;
        totalRevenue: number;
        profitMargin: number;
        bonusPool: number;
        distributedBonuses: number;
        participationRate: number;
        averagePerformanceScore: number;
        topPerformers: string[];
        departmentRankings: {
            departmentId: string;
            departmentName: string;
            averageScore: number;
            rank: number;
            bonusMultiplier: number;
            topPerformer: string;
        }[];
    } | null, CompanyPerformance | {
        period: string;
        totalRevenue: number;
        profitMargin: number;
        bonusPool: number;
        distributedBonuses: number;
        participationRate: number;
        averagePerformanceScore: number;
        topPerformers: string[];
        departmentRankings: {
            departmentId: string;
            departmentName: string;
            averageScore: number;
            rank: number;
            bonusMultiplier: number;
            topPerformer: string;
        }[];
    } | null>;
    loading: import("vue").Ref<boolean, boolean>;
    userLevel: import("vue").ComputedRef<number>;
    nextLevelProgress: import("vue").ComputedRef<number>;
    totalBonusEarned: import("vue").ComputedRef<number>;
    activeStreaks: import("vue").ComputedRef<{
        id: string;
        type: "efficiency" | "quality" | "safety" | "attendance" | "innovation";
        currentStreak: number;
        bestStreak: number;
        multiplier: number;
        bonusPerDay: number;
        isActive: boolean;
    }[]>;
    recentAchievements: import("vue").ComputedRef<{
        id: string;
        name: string;
        description: string;
        category: import("../types/performance").AchievementCategory;
        tier: "bronze" | "silver" | "gold" | "platinum" | "diamond";
        points: number;
        bonusAmount: number;
        icon: string;
        unlockedAt: string;
        requirements: {
            metric: string;
            operator: "greater_than" | "less_than" | "equal_to" | "streak";
            value: number;
            period?: string | undefined;
        }[];
        rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
    }[]>;
    activeChallenges: import("vue").ComputedRef<{
        id: string;
        name: string;
        description: string;
        type: "department" | "shift" | "machine" | "skill-level" | "cross-functional";
        startDate: string;
        endDate: string;
        participants: string[];
        teams: {
            id: string;
            name: string;
            members: string[];
            captain: string;
            score: number;
            rank: number;
            color: string;
            avatar: string;
        }[];
        metrics: string[];
        rewards: {
            rank: number;
            bonusAmount: number;
            points: number;
            badge?: string | undefined;
            perks?: string[] | undefined;
        }[];
        status: "upcoming" | "active" | "completed" | "cancelled";
        leaderboard: {
            teamId: string;
            teamName: string;
            score: number;
            rank: number;
            trend: "up" | "down" | "stable";
            members: string[];
        }[];
    }[]>;
    upcomingChallenges: import("vue").ComputedRef<{
        id: string;
        name: string;
        description: string;
        type: "department" | "shift" | "machine" | "skill-level" | "cross-functional";
        startDate: string;
        endDate: string;
        participants: string[];
        teams: {
            id: string;
            name: string;
            members: string[];
            captain: string;
            score: number;
            rank: number;
            color: string;
            avatar: string;
        }[];
        metrics: string[];
        rewards: {
            rank: number;
            bonusAmount: number;
            points: number;
            badge?: string | undefined;
            perks?: string[] | undefined;
        }[];
        status: "upcoming" | "active" | "completed" | "cancelled";
        leaderboard: {
            teamId: string;
            teamName: string;
            score: number;
            rank: number;
            trend: "up" | "down" | "stable";
            members: string[];
        }[];
    }[]>;
    currentSeasonalEvent: import("vue").ComputedRef<{
        id: string;
        name: string;
        description: string;
        theme: string;
        startDate: string;
        endDate: string;
        specialChallenges: string[];
        bonusMultipliers: Record<string, number>;
        exclusiveRewards: {
            id: string;
            name: string;
            description: string;
            category: import("../types/performance").AchievementCategory;
            tier: "bronze" | "silver" | "gold" | "platinum" | "diamond";
            points: number;
            bonusAmount: number;
            icon: string;
            unlockedAt: string;
            requirements: {
                metric: string;
                operator: "greater_than" | "less_than" | "equal_to" | "streak";
                value: number;
                period?: string | undefined;
            }[];
            rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
        }[];
        participationReward: number;
        isActive: boolean;
    } | undefined>;
    performanceGrade: import("vue").ComputedRef<"F" | "A+" | "A" | "B+" | "B" | "C+" | "C" | "D">;
    fetchUserMetrics: () => Promise<void>;
    fetchAchievements: () => Promise<void>;
    fetchTeamChallenges: () => Promise<void>;
    fetchBonusStructures: () => Promise<void>;
    fetchLeaderboard: () => Promise<void>;
    fetchSeasonalEvents: () => Promise<void>;
    fetchInsights: () => Promise<void>;
    submitInnovation: (innovation: Omit<InnovationSubmission, 'id' | 'submittedDate' | 'status' | 'votes'>) => Promise<void>;
    joinChallenge: (challengeId: string, teamId: string) => Promise<void>;
    calculateBonus: (metrics: PerformanceMetrics, bonusStructure: BonusStructure) => number;
}, "loading" | "achievements" | "leaderboard" | "userMetrics" | "teamChallenges" | "skillDevelopment" | "bonusStructures" | "innovations" | "seasonalEvents" | "mentorships" | "insights" | "companyPerformance">, Pick<{
    userMetrics: import("vue").Ref<{
        id: string;
        userId: string;
        period: "daily" | "weekly" | "monthly" | "quarterly" | "yearly";
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
        achievements: {
            id: string;
            name: string;
            description: string;
            category: import("../types/performance").AchievementCategory;
            tier: "bronze" | "silver" | "gold" | "platinum" | "diamond";
            points: number;
            bonusAmount: number;
            icon: string;
            unlockedAt: string;
            requirements: {
                metric: string;
                operator: "greater_than" | "less_than" | "equal_to" | "streak";
                value: number;
                period?: string | undefined;
            }[];
            rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
        }[];
        totalScore: number;
        rank: number;
        bonusEarned: number;
        streaks: {
            id: string;
            type: "efficiency" | "quality" | "safety" | "attendance" | "innovation";
            currentStreak: number;
            bestStreak: number;
            multiplier: number;
            bonusPerDay: number;
            isActive: boolean;
        }[];
    } | null, PerformanceMetrics | {
        id: string;
        userId: string;
        period: "daily" | "weekly" | "monthly" | "quarterly" | "yearly";
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
        achievements: {
            id: string;
            name: string;
            description: string;
            category: import("../types/performance").AchievementCategory;
            tier: "bronze" | "silver" | "gold" | "platinum" | "diamond";
            points: number;
            bonusAmount: number;
            icon: string;
            unlockedAt: string;
            requirements: {
                metric: string;
                operator: "greater_than" | "less_than" | "equal_to" | "streak";
                value: number;
                period?: string | undefined;
            }[];
            rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
        }[];
        totalScore: number;
        rank: number;
        bonusEarned: number;
        streaks: {
            id: string;
            type: "efficiency" | "quality" | "safety" | "attendance" | "innovation";
            currentStreak: number;
            bestStreak: number;
            multiplier: number;
            bonusPerDay: number;
            isActive: boolean;
        }[];
    } | null>;
    achievements: import("vue").Ref<{
        id: string;
        name: string;
        description: string;
        category: import("../types/performance").AchievementCategory;
        tier: "bronze" | "silver" | "gold" | "platinum" | "diamond";
        points: number;
        bonusAmount: number;
        icon: string;
        unlockedAt: string;
        requirements: {
            metric: string;
            operator: "greater_than" | "less_than" | "equal_to" | "streak";
            value: number;
            period?: string | undefined;
        }[];
        rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
    }[], Achievement[] | {
        id: string;
        name: string;
        description: string;
        category: import("../types/performance").AchievementCategory;
        tier: "bronze" | "silver" | "gold" | "platinum" | "diamond";
        points: number;
        bonusAmount: number;
        icon: string;
        unlockedAt: string;
        requirements: {
            metric: string;
            operator: "greater_than" | "less_than" | "equal_to" | "streak";
            value: number;
            period?: string | undefined;
        }[];
        rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
    }[]>;
    teamChallenges: import("vue").Ref<{
        id: string;
        name: string;
        description: string;
        type: "department" | "shift" | "machine" | "skill-level" | "cross-functional";
        startDate: string;
        endDate: string;
        participants: string[];
        teams: {
            id: string;
            name: string;
            members: string[];
            captain: string;
            score: number;
            rank: number;
            color: string;
            avatar: string;
        }[];
        metrics: string[];
        rewards: {
            rank: number;
            bonusAmount: number;
            points: number;
            badge?: string | undefined;
            perks?: string[] | undefined;
        }[];
        status: "upcoming" | "active" | "completed" | "cancelled";
        leaderboard: {
            teamId: string;
            teamName: string;
            score: number;
            rank: number;
            trend: "up" | "down" | "stable";
            members: string[];
        }[];
    }[], TeamChallenge[] | {
        id: string;
        name: string;
        description: string;
        type: "department" | "shift" | "machine" | "skill-level" | "cross-functional";
        startDate: string;
        endDate: string;
        participants: string[];
        teams: {
            id: string;
            name: string;
            members: string[];
            captain: string;
            score: number;
            rank: number;
            color: string;
            avatar: string;
        }[];
        metrics: string[];
        rewards: {
            rank: number;
            bonusAmount: number;
            points: number;
            badge?: string | undefined;
            perks?: string[] | undefined;
        }[];
        status: "upcoming" | "active" | "completed" | "cancelled";
        leaderboard: {
            teamId: string;
            teamName: string;
            score: number;
            rank: number;
            trend: "up" | "down" | "stable";
            members: string[];
        }[];
    }[]>;
    skillDevelopment: import("vue").Ref<{
        id: string;
        userId: string;
        skillName: string;
        category: import("../types/performance").SkillCategory;
        currentLevel: number;
        maxLevel: number;
        experience: number;
        experienceToNext: number;
        certifications: {
            id: string;
            name: string;
            issuer: string;
            earnedDate: string;
            expiryDate?: string | undefined;
            level: "basic" | "intermediate" | "advanced" | "expert" | "master";
            bonusAmount: number;
            skillPoints: number;
        }[];
        trainingCompleted: {
            id: string;
            name: string;
            category: string;
            duration: number;
            completedDate: string;
            score: number;
            bonusEarned: number;
            skillPointsEarned: number;
        }[];
        mentorshipHours: number;
        teachingHours: number;
        bonusMultiplier: number;
    }[], SkillDevelopment[] | {
        id: string;
        userId: string;
        skillName: string;
        category: import("../types/performance").SkillCategory;
        currentLevel: number;
        maxLevel: number;
        experience: number;
        experienceToNext: number;
        certifications: {
            id: string;
            name: string;
            issuer: string;
            earnedDate: string;
            expiryDate?: string | undefined;
            level: "basic" | "intermediate" | "advanced" | "expert" | "master";
            bonusAmount: number;
            skillPoints: number;
        }[];
        trainingCompleted: {
            id: string;
            name: string;
            category: string;
            duration: number;
            completedDate: string;
            score: number;
            bonusEarned: number;
            skillPointsEarned: number;
        }[];
        mentorshipHours: number;
        teachingHours: number;
        bonusMultiplier: number;
    }[]>;
    bonusStructures: import("vue").Ref<{
        id: string;
        name: string;
        type: "performance" | "innovation" | "streak" | "achievement" | "team" | "skill";
        baseAmount: number;
        multipliers: {
            condition: string;
            multiplier: number;
            description: string;
        }[];
        eligibility: {
            minTenure: number;
            minPerformanceScore: number;
            requiredCertifications?: string[] | undefined;
            excludedRoles?: string[] | undefined;
        };
        payoutSchedule: "weekly" | "monthly" | "quarterly" | "immediate";
        maxAmount?: number | undefined;
        isActive: boolean;
    }[], BonusStructure[] | {
        id: string;
        name: string;
        type: "performance" | "innovation" | "streak" | "achievement" | "team" | "skill";
        baseAmount: number;
        multipliers: {
            condition: string;
            multiplier: number;
            description: string;
        }[];
        eligibility: {
            minTenure: number;
            minPerformanceScore: number;
            requiredCertifications?: string[] | undefined;
            excludedRoles?: string[] | undefined;
        };
        payoutSchedule: "weekly" | "monthly" | "quarterly" | "immediate";
        maxAmount?: number | undefined;
        isActive: boolean;
    }[]>;
    innovations: import("vue").Ref<{
        id: string;
        userId: string;
        title: string;
        description: string;
        category: "process-improvement" | "cost-reduction" | "safety-enhancement" | "quality-improvement" | "efficiency-boost";
        submittedDate: string;
        status: "pending" | "under-review" | "approved" | "rejected" | "implemented";
        reviewers: string[];
        estimatedSavings: number;
        actualSavings?: number | undefined;
        implementationDate?: string | undefined;
        bonusAwarded: number;
        recognitionLevel: "department" | "industry" | "company";
        attachments: string[];
        votes: {
            userId: string;
            vote: "up" | "down";
            comment?: string | undefined;
            timestamp: string;
        }[];
    }[], InnovationSubmission[] | {
        id: string;
        userId: string;
        title: string;
        description: string;
        category: "process-improvement" | "cost-reduction" | "safety-enhancement" | "quality-improvement" | "efficiency-boost";
        submittedDate: string;
        status: "pending" | "under-review" | "approved" | "rejected" | "implemented";
        reviewers: string[];
        estimatedSavings: number;
        actualSavings?: number | undefined;
        implementationDate?: string | undefined;
        bonusAwarded: number;
        recognitionLevel: "department" | "industry" | "company";
        attachments: string[];
        votes: {
            userId: string;
            vote: "up" | "down";
            comment?: string | undefined;
            timestamp: string;
        }[];
    }[]>;
    leaderboard: import("vue").Ref<{
        userId: string;
        userName: string;
        department: string;
        role: string;
        score: number;
        rank: number;
        previousRank: number;
        trend: "up" | "down" | "stable";
        achievements: number;
        streaks: number;
        bonusEarned: number;
        avatar?: string | undefined;
        level: number;
    }[], LeaderboardEntry[] | {
        userId: string;
        userName: string;
        department: string;
        role: string;
        score: number;
        rank: number;
        previousRank: number;
        trend: "up" | "down" | "stable";
        achievements: number;
        streaks: number;
        bonusEarned: number;
        avatar?: string | undefined;
        level: number;
    }[]>;
    seasonalEvents: import("vue").Ref<{
        id: string;
        name: string;
        description: string;
        theme: string;
        startDate: string;
        endDate: string;
        specialChallenges: string[];
        bonusMultipliers: Record<string, number>;
        exclusiveRewards: {
            id: string;
            name: string;
            description: string;
            category: import("../types/performance").AchievementCategory;
            tier: "bronze" | "silver" | "gold" | "platinum" | "diamond";
            points: number;
            bonusAmount: number;
            icon: string;
            unlockedAt: string;
            requirements: {
                metric: string;
                operator: "greater_than" | "less_than" | "equal_to" | "streak";
                value: number;
                period?: string | undefined;
            }[];
            rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
        }[];
        participationReward: number;
        isActive: boolean;
    }[], SeasonalEvent[] | {
        id: string;
        name: string;
        description: string;
        theme: string;
        startDate: string;
        endDate: string;
        specialChallenges: string[];
        bonusMultipliers: Record<string, number>;
        exclusiveRewards: {
            id: string;
            name: string;
            description: string;
            category: import("../types/performance").AchievementCategory;
            tier: "bronze" | "silver" | "gold" | "platinum" | "diamond";
            points: number;
            bonusAmount: number;
            icon: string;
            unlockedAt: string;
            requirements: {
                metric: string;
                operator: "greater_than" | "less_than" | "equal_to" | "streak";
                value: number;
                period?: string | undefined;
            }[];
            rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
        }[];
        participationReward: number;
        isActive: boolean;
    }[]>;
    mentorships: import("vue").Ref<{
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
        progressMilestones: {
            id: string;
            name: string;
            description: string;
            targetDate: string;
            completedDate?: string | undefined;
            bonusAmount: number;
            isCompleted: boolean;
        }[];
        status: "active" | "completed" | "cancelled" | "paused";
    }[], MentorshipProgram[] | {
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
        progressMilestones: {
            id: string;
            name: string;
            description: string;
            targetDate: string;
            completedDate?: string | undefined;
            bonusAmount: number;
            isCompleted: boolean;
        }[];
        status: "active" | "completed" | "cancelled" | "paused";
    }[]>;
    insights: import("vue").Ref<{
        id: string;
        userId: string;
        type: "strength" | "improvement" | "opportunity" | "risk";
        title: string;
        description: string;
        actionItems: string[];
        potentialBonus: number;
        priority: "critical" | "low" | "medium" | "high";
        category: string;
        generatedDate: string;
    }[], PerformanceInsight[] | {
        id: string;
        userId: string;
        type: "strength" | "improvement" | "opportunity" | "risk";
        title: string;
        description: string;
        actionItems: string[];
        potentialBonus: number;
        priority: "critical" | "low" | "medium" | "high";
        category: string;
        generatedDate: string;
    }[]>;
    companyPerformance: import("vue").Ref<{
        period: string;
        totalRevenue: number;
        profitMargin: number;
        bonusPool: number;
        distributedBonuses: number;
        participationRate: number;
        averagePerformanceScore: number;
        topPerformers: string[];
        departmentRankings: {
            departmentId: string;
            departmentName: string;
            averageScore: number;
            rank: number;
            bonusMultiplier: number;
            topPerformer: string;
        }[];
    } | null, CompanyPerformance | {
        period: string;
        totalRevenue: number;
        profitMargin: number;
        bonusPool: number;
        distributedBonuses: number;
        participationRate: number;
        averagePerformanceScore: number;
        topPerformers: string[];
        departmentRankings: {
            departmentId: string;
            departmentName: string;
            averageScore: number;
            rank: number;
            bonusMultiplier: number;
            topPerformer: string;
        }[];
    } | null>;
    loading: import("vue").Ref<boolean, boolean>;
    userLevel: import("vue").ComputedRef<number>;
    nextLevelProgress: import("vue").ComputedRef<number>;
    totalBonusEarned: import("vue").ComputedRef<number>;
    activeStreaks: import("vue").ComputedRef<{
        id: string;
        type: "efficiency" | "quality" | "safety" | "attendance" | "innovation";
        currentStreak: number;
        bestStreak: number;
        multiplier: number;
        bonusPerDay: number;
        isActive: boolean;
    }[]>;
    recentAchievements: import("vue").ComputedRef<{
        id: string;
        name: string;
        description: string;
        category: import("../types/performance").AchievementCategory;
        tier: "bronze" | "silver" | "gold" | "platinum" | "diamond";
        points: number;
        bonusAmount: number;
        icon: string;
        unlockedAt: string;
        requirements: {
            metric: string;
            operator: "greater_than" | "less_than" | "equal_to" | "streak";
            value: number;
            period?: string | undefined;
        }[];
        rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
    }[]>;
    activeChallenges: import("vue").ComputedRef<{
        id: string;
        name: string;
        description: string;
        type: "department" | "shift" | "machine" | "skill-level" | "cross-functional";
        startDate: string;
        endDate: string;
        participants: string[];
        teams: {
            id: string;
            name: string;
            members: string[];
            captain: string;
            score: number;
            rank: number;
            color: string;
            avatar: string;
        }[];
        metrics: string[];
        rewards: {
            rank: number;
            bonusAmount: number;
            points: number;
            badge?: string | undefined;
            perks?: string[] | undefined;
        }[];
        status: "upcoming" | "active" | "completed" | "cancelled";
        leaderboard: {
            teamId: string;
            teamName: string;
            score: number;
            rank: number;
            trend: "up" | "down" | "stable";
            members: string[];
        }[];
    }[]>;
    upcomingChallenges: import("vue").ComputedRef<{
        id: string;
        name: string;
        description: string;
        type: "department" | "shift" | "machine" | "skill-level" | "cross-functional";
        startDate: string;
        endDate: string;
        participants: string[];
        teams: {
            id: string;
            name: string;
            members: string[];
            captain: string;
            score: number;
            rank: number;
            color: string;
            avatar: string;
        }[];
        metrics: string[];
        rewards: {
            rank: number;
            bonusAmount: number;
            points: number;
            badge?: string | undefined;
            perks?: string[] | undefined;
        }[];
        status: "upcoming" | "active" | "completed" | "cancelled";
        leaderboard: {
            teamId: string;
            teamName: string;
            score: number;
            rank: number;
            trend: "up" | "down" | "stable";
            members: string[];
        }[];
    }[]>;
    currentSeasonalEvent: import("vue").ComputedRef<{
        id: string;
        name: string;
        description: string;
        theme: string;
        startDate: string;
        endDate: string;
        specialChallenges: string[];
        bonusMultipliers: Record<string, number>;
        exclusiveRewards: {
            id: string;
            name: string;
            description: string;
            category: import("../types/performance").AchievementCategory;
            tier: "bronze" | "silver" | "gold" | "platinum" | "diamond";
            points: number;
            bonusAmount: number;
            icon: string;
            unlockedAt: string;
            requirements: {
                metric: string;
                operator: "greater_than" | "less_than" | "equal_to" | "streak";
                value: number;
                period?: string | undefined;
            }[];
            rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
        }[];
        participationReward: number;
        isActive: boolean;
    } | undefined>;
    performanceGrade: import("vue").ComputedRef<"F" | "A+" | "A" | "B+" | "B" | "C+" | "C" | "D">;
    fetchUserMetrics: () => Promise<void>;
    fetchAchievements: () => Promise<void>;
    fetchTeamChallenges: () => Promise<void>;
    fetchBonusStructures: () => Promise<void>;
    fetchLeaderboard: () => Promise<void>;
    fetchSeasonalEvents: () => Promise<void>;
    fetchInsights: () => Promise<void>;
    submitInnovation: (innovation: Omit<InnovationSubmission, 'id' | 'submittedDate' | 'status' | 'votes'>) => Promise<void>;
    joinChallenge: (challengeId: string, teamId: string) => Promise<void>;
    calculateBonus: (metrics: PerformanceMetrics, bonusStructure: BonusStructure) => number;
}, "userLevel" | "nextLevelProgress" | "totalBonusEarned" | "activeStreaks" | "recentAchievements" | "activeChallenges" | "upcomingChallenges" | "currentSeasonalEvent" | "performanceGrade">, Pick<{
    userMetrics: import("vue").Ref<{
        id: string;
        userId: string;
        period: "daily" | "weekly" | "monthly" | "quarterly" | "yearly";
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
        achievements: {
            id: string;
            name: string;
            description: string;
            category: import("../types/performance").AchievementCategory;
            tier: "bronze" | "silver" | "gold" | "platinum" | "diamond";
            points: number;
            bonusAmount: number;
            icon: string;
            unlockedAt: string;
            requirements: {
                metric: string;
                operator: "greater_than" | "less_than" | "equal_to" | "streak";
                value: number;
                period?: string | undefined;
            }[];
            rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
        }[];
        totalScore: number;
        rank: number;
        bonusEarned: number;
        streaks: {
            id: string;
            type: "efficiency" | "quality" | "safety" | "attendance" | "innovation";
            currentStreak: number;
            bestStreak: number;
            multiplier: number;
            bonusPerDay: number;
            isActive: boolean;
        }[];
    } | null, PerformanceMetrics | {
        id: string;
        userId: string;
        period: "daily" | "weekly" | "monthly" | "quarterly" | "yearly";
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
        achievements: {
            id: string;
            name: string;
            description: string;
            category: import("../types/performance").AchievementCategory;
            tier: "bronze" | "silver" | "gold" | "platinum" | "diamond";
            points: number;
            bonusAmount: number;
            icon: string;
            unlockedAt: string;
            requirements: {
                metric: string;
                operator: "greater_than" | "less_than" | "equal_to" | "streak";
                value: number;
                period?: string | undefined;
            }[];
            rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
        }[];
        totalScore: number;
        rank: number;
        bonusEarned: number;
        streaks: {
            id: string;
            type: "efficiency" | "quality" | "safety" | "attendance" | "innovation";
            currentStreak: number;
            bestStreak: number;
            multiplier: number;
            bonusPerDay: number;
            isActive: boolean;
        }[];
    } | null>;
    achievements: import("vue").Ref<{
        id: string;
        name: string;
        description: string;
        category: import("../types/performance").AchievementCategory;
        tier: "bronze" | "silver" | "gold" | "platinum" | "diamond";
        points: number;
        bonusAmount: number;
        icon: string;
        unlockedAt: string;
        requirements: {
            metric: string;
            operator: "greater_than" | "less_than" | "equal_to" | "streak";
            value: number;
            period?: string | undefined;
        }[];
        rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
    }[], Achievement[] | {
        id: string;
        name: string;
        description: string;
        category: import("../types/performance").AchievementCategory;
        tier: "bronze" | "silver" | "gold" | "platinum" | "diamond";
        points: number;
        bonusAmount: number;
        icon: string;
        unlockedAt: string;
        requirements: {
            metric: string;
            operator: "greater_than" | "less_than" | "equal_to" | "streak";
            value: number;
            period?: string | undefined;
        }[];
        rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
    }[]>;
    teamChallenges: import("vue").Ref<{
        id: string;
        name: string;
        description: string;
        type: "department" | "shift" | "machine" | "skill-level" | "cross-functional";
        startDate: string;
        endDate: string;
        participants: string[];
        teams: {
            id: string;
            name: string;
            members: string[];
            captain: string;
            score: number;
            rank: number;
            color: string;
            avatar: string;
        }[];
        metrics: string[];
        rewards: {
            rank: number;
            bonusAmount: number;
            points: number;
            badge?: string | undefined;
            perks?: string[] | undefined;
        }[];
        status: "upcoming" | "active" | "completed" | "cancelled";
        leaderboard: {
            teamId: string;
            teamName: string;
            score: number;
            rank: number;
            trend: "up" | "down" | "stable";
            members: string[];
        }[];
    }[], TeamChallenge[] | {
        id: string;
        name: string;
        description: string;
        type: "department" | "shift" | "machine" | "skill-level" | "cross-functional";
        startDate: string;
        endDate: string;
        participants: string[];
        teams: {
            id: string;
            name: string;
            members: string[];
            captain: string;
            score: number;
            rank: number;
            color: string;
            avatar: string;
        }[];
        metrics: string[];
        rewards: {
            rank: number;
            bonusAmount: number;
            points: number;
            badge?: string | undefined;
            perks?: string[] | undefined;
        }[];
        status: "upcoming" | "active" | "completed" | "cancelled";
        leaderboard: {
            teamId: string;
            teamName: string;
            score: number;
            rank: number;
            trend: "up" | "down" | "stable";
            members: string[];
        }[];
    }[]>;
    skillDevelopment: import("vue").Ref<{
        id: string;
        userId: string;
        skillName: string;
        category: import("../types/performance").SkillCategory;
        currentLevel: number;
        maxLevel: number;
        experience: number;
        experienceToNext: number;
        certifications: {
            id: string;
            name: string;
            issuer: string;
            earnedDate: string;
            expiryDate?: string | undefined;
            level: "basic" | "intermediate" | "advanced" | "expert" | "master";
            bonusAmount: number;
            skillPoints: number;
        }[];
        trainingCompleted: {
            id: string;
            name: string;
            category: string;
            duration: number;
            completedDate: string;
            score: number;
            bonusEarned: number;
            skillPointsEarned: number;
        }[];
        mentorshipHours: number;
        teachingHours: number;
        bonusMultiplier: number;
    }[], SkillDevelopment[] | {
        id: string;
        userId: string;
        skillName: string;
        category: import("../types/performance").SkillCategory;
        currentLevel: number;
        maxLevel: number;
        experience: number;
        experienceToNext: number;
        certifications: {
            id: string;
            name: string;
            issuer: string;
            earnedDate: string;
            expiryDate?: string | undefined;
            level: "basic" | "intermediate" | "advanced" | "expert" | "master";
            bonusAmount: number;
            skillPoints: number;
        }[];
        trainingCompleted: {
            id: string;
            name: string;
            category: string;
            duration: number;
            completedDate: string;
            score: number;
            bonusEarned: number;
            skillPointsEarned: number;
        }[];
        mentorshipHours: number;
        teachingHours: number;
        bonusMultiplier: number;
    }[]>;
    bonusStructures: import("vue").Ref<{
        id: string;
        name: string;
        type: "performance" | "innovation" | "streak" | "achievement" | "team" | "skill";
        baseAmount: number;
        multipliers: {
            condition: string;
            multiplier: number;
            description: string;
        }[];
        eligibility: {
            minTenure: number;
            minPerformanceScore: number;
            requiredCertifications?: string[] | undefined;
            excludedRoles?: string[] | undefined;
        };
        payoutSchedule: "weekly" | "monthly" | "quarterly" | "immediate";
        maxAmount?: number | undefined;
        isActive: boolean;
    }[], BonusStructure[] | {
        id: string;
        name: string;
        type: "performance" | "innovation" | "streak" | "achievement" | "team" | "skill";
        baseAmount: number;
        multipliers: {
            condition: string;
            multiplier: number;
            description: string;
        }[];
        eligibility: {
            minTenure: number;
            minPerformanceScore: number;
            requiredCertifications?: string[] | undefined;
            excludedRoles?: string[] | undefined;
        };
        payoutSchedule: "weekly" | "monthly" | "quarterly" | "immediate";
        maxAmount?: number | undefined;
        isActive: boolean;
    }[]>;
    innovations: import("vue").Ref<{
        id: string;
        userId: string;
        title: string;
        description: string;
        category: "process-improvement" | "cost-reduction" | "safety-enhancement" | "quality-improvement" | "efficiency-boost";
        submittedDate: string;
        status: "pending" | "under-review" | "approved" | "rejected" | "implemented";
        reviewers: string[];
        estimatedSavings: number;
        actualSavings?: number | undefined;
        implementationDate?: string | undefined;
        bonusAwarded: number;
        recognitionLevel: "department" | "industry" | "company";
        attachments: string[];
        votes: {
            userId: string;
            vote: "up" | "down";
            comment?: string | undefined;
            timestamp: string;
        }[];
    }[], InnovationSubmission[] | {
        id: string;
        userId: string;
        title: string;
        description: string;
        category: "process-improvement" | "cost-reduction" | "safety-enhancement" | "quality-improvement" | "efficiency-boost";
        submittedDate: string;
        status: "pending" | "under-review" | "approved" | "rejected" | "implemented";
        reviewers: string[];
        estimatedSavings: number;
        actualSavings?: number | undefined;
        implementationDate?: string | undefined;
        bonusAwarded: number;
        recognitionLevel: "department" | "industry" | "company";
        attachments: string[];
        votes: {
            userId: string;
            vote: "up" | "down";
            comment?: string | undefined;
            timestamp: string;
        }[];
    }[]>;
    leaderboard: import("vue").Ref<{
        userId: string;
        userName: string;
        department: string;
        role: string;
        score: number;
        rank: number;
        previousRank: number;
        trend: "up" | "down" | "stable";
        achievements: number;
        streaks: number;
        bonusEarned: number;
        avatar?: string | undefined;
        level: number;
    }[], LeaderboardEntry[] | {
        userId: string;
        userName: string;
        department: string;
        role: string;
        score: number;
        rank: number;
        previousRank: number;
        trend: "up" | "down" | "stable";
        achievements: number;
        streaks: number;
        bonusEarned: number;
        avatar?: string | undefined;
        level: number;
    }[]>;
    seasonalEvents: import("vue").Ref<{
        id: string;
        name: string;
        description: string;
        theme: string;
        startDate: string;
        endDate: string;
        specialChallenges: string[];
        bonusMultipliers: Record<string, number>;
        exclusiveRewards: {
            id: string;
            name: string;
            description: string;
            category: import("../types/performance").AchievementCategory;
            tier: "bronze" | "silver" | "gold" | "platinum" | "diamond";
            points: number;
            bonusAmount: number;
            icon: string;
            unlockedAt: string;
            requirements: {
                metric: string;
                operator: "greater_than" | "less_than" | "equal_to" | "streak";
                value: number;
                period?: string | undefined;
            }[];
            rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
        }[];
        participationReward: number;
        isActive: boolean;
    }[], SeasonalEvent[] | {
        id: string;
        name: string;
        description: string;
        theme: string;
        startDate: string;
        endDate: string;
        specialChallenges: string[];
        bonusMultipliers: Record<string, number>;
        exclusiveRewards: {
            id: string;
            name: string;
            description: string;
            category: import("../types/performance").AchievementCategory;
            tier: "bronze" | "silver" | "gold" | "platinum" | "diamond";
            points: number;
            bonusAmount: number;
            icon: string;
            unlockedAt: string;
            requirements: {
                metric: string;
                operator: "greater_than" | "less_than" | "equal_to" | "streak";
                value: number;
                period?: string | undefined;
            }[];
            rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
        }[];
        participationReward: number;
        isActive: boolean;
    }[]>;
    mentorships: import("vue").Ref<{
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
        progressMilestones: {
            id: string;
            name: string;
            description: string;
            targetDate: string;
            completedDate?: string | undefined;
            bonusAmount: number;
            isCompleted: boolean;
        }[];
        status: "active" | "completed" | "cancelled" | "paused";
    }[], MentorshipProgram[] | {
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
        progressMilestones: {
            id: string;
            name: string;
            description: string;
            targetDate: string;
            completedDate?: string | undefined;
            bonusAmount: number;
            isCompleted: boolean;
        }[];
        status: "active" | "completed" | "cancelled" | "paused";
    }[]>;
    insights: import("vue").Ref<{
        id: string;
        userId: string;
        type: "strength" | "improvement" | "opportunity" | "risk";
        title: string;
        description: string;
        actionItems: string[];
        potentialBonus: number;
        priority: "critical" | "low" | "medium" | "high";
        category: string;
        generatedDate: string;
    }[], PerformanceInsight[] | {
        id: string;
        userId: string;
        type: "strength" | "improvement" | "opportunity" | "risk";
        title: string;
        description: string;
        actionItems: string[];
        potentialBonus: number;
        priority: "critical" | "low" | "medium" | "high";
        category: string;
        generatedDate: string;
    }[]>;
    companyPerformance: import("vue").Ref<{
        period: string;
        totalRevenue: number;
        profitMargin: number;
        bonusPool: number;
        distributedBonuses: number;
        participationRate: number;
        averagePerformanceScore: number;
        topPerformers: string[];
        departmentRankings: {
            departmentId: string;
            departmentName: string;
            averageScore: number;
            rank: number;
            bonusMultiplier: number;
            topPerformer: string;
        }[];
    } | null, CompanyPerformance | {
        period: string;
        totalRevenue: number;
        profitMargin: number;
        bonusPool: number;
        distributedBonuses: number;
        participationRate: number;
        averagePerformanceScore: number;
        topPerformers: string[];
        departmentRankings: {
            departmentId: string;
            departmentName: string;
            averageScore: number;
            rank: number;
            bonusMultiplier: number;
            topPerformer: string;
        }[];
    } | null>;
    loading: import("vue").Ref<boolean, boolean>;
    userLevel: import("vue").ComputedRef<number>;
    nextLevelProgress: import("vue").ComputedRef<number>;
    totalBonusEarned: import("vue").ComputedRef<number>;
    activeStreaks: import("vue").ComputedRef<{
        id: string;
        type: "efficiency" | "quality" | "safety" | "attendance" | "innovation";
        currentStreak: number;
        bestStreak: number;
        multiplier: number;
        bonusPerDay: number;
        isActive: boolean;
    }[]>;
    recentAchievements: import("vue").ComputedRef<{
        id: string;
        name: string;
        description: string;
        category: import("../types/performance").AchievementCategory;
        tier: "bronze" | "silver" | "gold" | "platinum" | "diamond";
        points: number;
        bonusAmount: number;
        icon: string;
        unlockedAt: string;
        requirements: {
            metric: string;
            operator: "greater_than" | "less_than" | "equal_to" | "streak";
            value: number;
            period?: string | undefined;
        }[];
        rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
    }[]>;
    activeChallenges: import("vue").ComputedRef<{
        id: string;
        name: string;
        description: string;
        type: "department" | "shift" | "machine" | "skill-level" | "cross-functional";
        startDate: string;
        endDate: string;
        participants: string[];
        teams: {
            id: string;
            name: string;
            members: string[];
            captain: string;
            score: number;
            rank: number;
            color: string;
            avatar: string;
        }[];
        metrics: string[];
        rewards: {
            rank: number;
            bonusAmount: number;
            points: number;
            badge?: string | undefined;
            perks?: string[] | undefined;
        }[];
        status: "upcoming" | "active" | "completed" | "cancelled";
        leaderboard: {
            teamId: string;
            teamName: string;
            score: number;
            rank: number;
            trend: "up" | "down" | "stable";
            members: string[];
        }[];
    }[]>;
    upcomingChallenges: import("vue").ComputedRef<{
        id: string;
        name: string;
        description: string;
        type: "department" | "shift" | "machine" | "skill-level" | "cross-functional";
        startDate: string;
        endDate: string;
        participants: string[];
        teams: {
            id: string;
            name: string;
            members: string[];
            captain: string;
            score: number;
            rank: number;
            color: string;
            avatar: string;
        }[];
        metrics: string[];
        rewards: {
            rank: number;
            bonusAmount: number;
            points: number;
            badge?: string | undefined;
            perks?: string[] | undefined;
        }[];
        status: "upcoming" | "active" | "completed" | "cancelled";
        leaderboard: {
            teamId: string;
            teamName: string;
            score: number;
            rank: number;
            trend: "up" | "down" | "stable";
            members: string[];
        }[];
    }[]>;
    currentSeasonalEvent: import("vue").ComputedRef<{
        id: string;
        name: string;
        description: string;
        theme: string;
        startDate: string;
        endDate: string;
        specialChallenges: string[];
        bonusMultipliers: Record<string, number>;
        exclusiveRewards: {
            id: string;
            name: string;
            description: string;
            category: import("../types/performance").AchievementCategory;
            tier: "bronze" | "silver" | "gold" | "platinum" | "diamond";
            points: number;
            bonusAmount: number;
            icon: string;
            unlockedAt: string;
            requirements: {
                metric: string;
                operator: "greater_than" | "less_than" | "equal_to" | "streak";
                value: number;
                period?: string | undefined;
            }[];
            rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
        }[];
        participationReward: number;
        isActive: boolean;
    } | undefined>;
    performanceGrade: import("vue").ComputedRef<"F" | "A+" | "A" | "B+" | "B" | "C+" | "C" | "D">;
    fetchUserMetrics: () => Promise<void>;
    fetchAchievements: () => Promise<void>;
    fetchTeamChallenges: () => Promise<void>;
    fetchBonusStructures: () => Promise<void>;
    fetchLeaderboard: () => Promise<void>;
    fetchSeasonalEvents: () => Promise<void>;
    fetchInsights: () => Promise<void>;
    submitInnovation: (innovation: Omit<InnovationSubmission, 'id' | 'submittedDate' | 'status' | 'votes'>) => Promise<void>;
    joinChallenge: (challengeId: string, teamId: string) => Promise<void>;
    calculateBonus: (metrics: PerformanceMetrics, bonusStructure: BonusStructure) => number;
}, "fetchUserMetrics" | "fetchAchievements" | "fetchTeamChallenges" | "fetchBonusStructures" | "fetchLeaderboard" | "fetchSeasonalEvents" | "fetchInsights" | "submitInnovation" | "joinChallenge" | "calculateBonus">>;
