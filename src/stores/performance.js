"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usePerformanceStore = void 0;
var pinia_1 = require("pinia");
var vue_1 = require("vue");
exports.usePerformanceStore = (0, pinia_1.defineStore)('performance', function () {
    var userMetrics = (0, vue_1.ref)(null);
    var achievements = (0, vue_1.ref)([]);
    var teamChallenges = (0, vue_1.ref)([]);
    var skillDevelopment = (0, vue_1.ref)([]);
    var bonusStructures = (0, vue_1.ref)([]);
    var innovations = (0, vue_1.ref)([]);
    var leaderboard = (0, vue_1.ref)([]);
    var seasonalEvents = (0, vue_1.ref)([]);
    var mentorships = (0, vue_1.ref)([]);
    var insights = (0, vue_1.ref)([]);
    var companyPerformance = (0, vue_1.ref)(null);
    var loading = (0, vue_1.ref)(false);
    // Mock data for demonstration
    var mockUserMetrics = {
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
    var mockAchievements = [
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
    var mockTeamChallenges = [
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
    var mockBonusStructures = [
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
    var mockLeaderboard = [
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
    var mockSeasonalEvents = [
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
    var mockInsights = [
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
    var fetchUserMetrics = function (userId_1) {
        var args_1 = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args_1[_i - 1] = arguments[_i];
        }
        return __awaiter(void 0, __spreadArray([userId_1], args_1, true), void 0, function (userId, period) {
            if (period === void 0) { period = 'monthly'; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        loading.value = true;
                        return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 800); })];
                    case 1:
                        _a.sent();
                        userMetrics.value = mockUserMetrics;
                        loading.value = false;
                        return [2 /*return*/];
                }
            });
        });
    };
    var fetchAchievements = function (userId) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    loading.value = true;
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 600); })];
                case 1:
                    _a.sent();
                    achievements.value = mockAchievements;
                    loading.value = false;
                    return [2 /*return*/];
            }
        });
    }); };
    var fetchTeamChallenges = function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    loading.value = true;
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 500); })];
                case 1:
                    _a.sent();
                    teamChallenges.value = mockTeamChallenges;
                    loading.value = false;
                    return [2 /*return*/];
            }
        });
    }); };
    var fetchBonusStructures = function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    loading.value = true;
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 400); })];
                case 1:
                    _a.sent();
                    bonusStructures.value = mockBonusStructures;
                    loading.value = false;
                    return [2 /*return*/];
            }
        });
    }); };
    var fetchLeaderboard = function () {
        var args_1 = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args_1[_i] = arguments[_i];
        }
        return __awaiter(void 0, __spreadArray([], args_1, true), void 0, function (period, department) {
            if (period === void 0) { period = 'monthly'; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        loading.value = true;
                        return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 700); })];
                    case 1:
                        _a.sent();
                        leaderboard.value = mockLeaderboard;
                        loading.value = false;
                        return [2 /*return*/];
                }
            });
        });
    };
    var fetchSeasonalEvents = function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    loading.value = true;
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 300); })];
                case 1:
                    _a.sent();
                    seasonalEvents.value = mockSeasonalEvents;
                    loading.value = false;
                    return [2 /*return*/];
            }
        });
    }); };
    var fetchInsights = function (userId) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    loading.value = true;
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 500); })];
                case 1:
                    _a.sent();
                    insights.value = mockInsights;
                    loading.value = false;
                    return [2 /*return*/];
            }
        });
    }); };
    var submitInnovation = function (innovation) { return __awaiter(void 0, void 0, void 0, function () {
        var newInnovation;
        return __generator(this, function (_a) {
            newInnovation = __assign(__assign({}, innovation), { id: Date.now().toString(), submittedDate: new Date().toISOString(), status: 'pending', votes: [] });
            innovations.value.unshift(newInnovation);
            return [2 /*return*/];
        });
    }); };
    var joinChallenge = function (challengeId, teamId) { return __awaiter(void 0, void 0, void 0, function () {
        var challenge;
        return __generator(this, function (_a) {
            challenge = teamChallenges.value.find(function (c) { return c.id === challengeId; });
            if (challenge) {
                // Implementation would add user to team
                console.log('Joining challenge:', challengeId, 'team:', teamId);
            }
            return [2 /*return*/];
        });
    }); };
    var calculateBonus = function (metrics, bonusStructure) {
        var bonus = bonusStructure.baseAmount;
        // Apply multipliers based on performance
        for (var _i = 0, _a = bonusStructure.multipliers; _i < _a.length; _i++) {
            var multiplier = _a[_i];
            if (evaluateCondition(multiplier.condition, metrics)) {
                bonus *= multiplier.multiplier;
                break; // Apply only the first matching multiplier
            }
        }
        // Apply streak bonuses
        metrics.streaks.forEach(function (streak) {
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
    var evaluateCondition = function (condition, metrics) {
        // Simple condition evaluation (would be more sophisticated in real implementation)
        if (condition.includes('score >=')) {
            var threshold = parseInt(condition.split('>=')[1].trim());
            return metrics.totalScore >= threshold;
        }
        return false;
    };
    // Computed properties
    var userLevel = (0, vue_1.computed)(function () {
        if (!userMetrics.value)
            return 1;
        return Math.floor(userMetrics.value.totalScore / 10) + 1;
    });
    var nextLevelProgress = (0, vue_1.computed)(function () {
        if (!userMetrics.value)
            return 0;
        var currentLevelMin = (userLevel.value - 1) * 10;
        var nextLevelMin = userLevel.value * 10;
        return ((userMetrics.value.totalScore - currentLevelMin) / (nextLevelMin - currentLevelMin)) * 100;
    });
    var totalBonusEarned = (0, vue_1.computed)(function () {
        var _a;
        return ((_a = userMetrics.value) === null || _a === void 0 ? void 0 : _a.bonusEarned) || 0;
    });
    var activeStreaks = (0, vue_1.computed)(function () {
        var _a;
        return ((_a = userMetrics.value) === null || _a === void 0 ? void 0 : _a.streaks.filter(function (s) { return s.isActive; })) || [];
    });
    var recentAchievements = (0, vue_1.computed)(function () {
        return achievements.value
            .sort(function (a, b) { return new Date(b.unlockedAt).getTime() - new Date(a.unlockedAt).getTime(); })
            .slice(0, 5);
    });
    var activeChallenges = (0, vue_1.computed)(function () {
        return teamChallenges.value.filter(function (c) { return c.status === 'active'; });
    });
    var upcomingChallenges = (0, vue_1.computed)(function () {
        return teamChallenges.value.filter(function (c) { return c.status === 'upcoming'; });
    });
    var currentSeasonalEvent = (0, vue_1.computed)(function () {
        var now = new Date();
        return seasonalEvents.value.find(function (event) {
            var start = new Date(event.startDate);
            var end = new Date(event.endDate);
            return now >= start && now <= end && event.isActive;
        });
    });
    var performanceGrade = (0, vue_1.computed)(function () {
        if (!userMetrics.value)
            return 'F';
        var score = userMetrics.value.totalScore;
        if (score >= 95)
            return 'A+';
        if (score >= 90)
            return 'A';
        if (score >= 85)
            return 'B+';
        if (score >= 80)
            return 'B';
        if (score >= 75)
            return 'C+';
        if (score >= 70)
            return 'C';
        if (score >= 65)
            return 'D';
        return 'F';
    });
    return {
        userMetrics: userMetrics,
        achievements: achievements,
        teamChallenges: teamChallenges,
        skillDevelopment: skillDevelopment,
        bonusStructures: bonusStructures,
        innovations: innovations,
        leaderboard: leaderboard,
        seasonalEvents: seasonalEvents,
        mentorships: mentorships,
        insights: insights,
        companyPerformance: companyPerformance,
        loading: loading,
        userLevel: userLevel,
        nextLevelProgress: nextLevelProgress,
        totalBonusEarned: totalBonusEarned,
        activeStreaks: activeStreaks,
        recentAchievements: recentAchievements,
        activeChallenges: activeChallenges,
        upcomingChallenges: upcomingChallenges,
        currentSeasonalEvent: currentSeasonalEvent,
        performanceGrade: performanceGrade,
        fetchUserMetrics: fetchUserMetrics,
        fetchAchievements: fetchAchievements,
        fetchTeamChallenges: fetchTeamChallenges,
        fetchBonusStructures: fetchBonusStructures,
        fetchLeaderboard: fetchLeaderboard,
        fetchSeasonalEvents: fetchSeasonalEvents,
        fetchInsights: fetchInsights,
        submitInnovation: submitInnovation,
        joinChallenge: joinChallenge,
        calculateBonus: calculateBonus
    };
});
