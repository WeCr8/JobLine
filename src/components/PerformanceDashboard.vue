<template>
  <div class="space-y-6">
    <!-- Performance Header -->
    <div class="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-6 text-white">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold mb-2">JobLine Performance Plus</h2>
          <p class="text-purple-100">Your performance journey with rewards and recognition</p>
        </div>
        <div class="text-right">
          <div class="text-3xl font-bold">${{ performanceStore.totalBonusEarned.toLocaleString() }}</div>
          <div class="text-purple-100">Total Bonuses Earned</div>
          <div class="text-sm text-purple-200 mt-1">Grade: {{ performanceStore.performanceGrade }}</div>
        </div>
      </div>
      
      <!-- Level Progress -->
      <div class="mt-4">
        <div class="flex items-center justify-between text-sm text-purple-100 mb-2">
          <span>Level {{ performanceStore.userLevel }}</span>
          <span>{{ Math.round(performanceStore.nextLevelProgress) }}% to Level {{ performanceStore.userLevel + 1 }}</span>
        </div>
        <div class="w-full bg-purple-800 rounded-full h-3">
          <div 
            class="bg-white h-3 rounded-full transition-all duration-500"
            :style="{ width: `${performanceStore.nextLevelProgress}%` }"
          ></div>
        </div>
      </div>
    </div>

    <!-- Quick Stats -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Performance Score</p>
            <p class="text-2xl font-bold text-gray-900">{{ userMetrics?.totalScore || 0 }}</p>
          </div>
          <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <TrophyIcon class="w-6 h-6 text-blue-600" />
          </div>
        </div>
        <div class="mt-2">
          <span class="text-sm text-blue-600 font-medium">Rank #{{ userMetrics?.rank || 0 }}</span>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Active Streaks</p>
            <p class="text-2xl font-bold text-gray-900">{{ performanceStore.activeStreaks.length }}</p>
          </div>
          <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
            <FireIcon class="w-6 h-6 text-orange-600" />
          </div>
        </div>
        <div class="mt-2">
          <span class="text-sm text-orange-600 font-medium">
            {{ performanceStore.activeStreaks.reduce((sum, s) => sum + s.currentStreak, 0) }} total days
          </span>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Achievements</p>
            <p class="text-2xl font-bold text-gray-900">{{ performanceStore.achievements.length }}</p>
          </div>
          <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <StarIcon class="w-6 h-6 text-purple-600" />
          </div>
        </div>
        <div class="mt-2">
          <span class="text-sm text-purple-600 font-medium">
            {{ performanceStore.achievements.filter(a => a.rarity === 'legendary' || a.rarity === 'epic').length }} rare
          </span>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">This Month</p>
            <p class="text-2xl font-bold text-gray-900">${{ (userMetrics?.bonusEarned || 0).toLocaleString() }}</p>
          </div>
          <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <CurrencyDollarIcon class="w-6 h-6 text-green-600" />
          </div>
        </div>
        <div class="mt-2">
          <span class="text-sm text-green-600 font-medium">+15% from last month</span>
        </div>
      </div>
    </div>

    <!-- Main Content Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Performance Metrics -->
      <div class="lg:col-span-2">
        <div class="bg-white rounded-lg shadow-sm border border-gray-200">
          <div class="p-6 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900">Performance Metrics</h3>
          </div>
          
          <div class="p-6">
            <div v-if="userMetrics" class="space-y-6">
              <div
                v-for="(value, metric) in userMetrics.metrics"
                :key="metric"
                class="flex items-center justify-between"
              >
                <div class="flex-1">
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-sm font-medium text-gray-700 capitalize">{{ formatMetricName(metric) }}</span>
                    <div class="flex items-center space-x-2">
                      <span class="text-sm font-bold text-gray-900">{{ value }}%</span>
                      <span 
                        class="text-xs px-2 py-0.5 rounded-full"
                        :class="getMetricStatusClass(value, userMetrics.goals[metric])"
                      >
                        {{ value >= userMetrics.goals[metric] ? 'Target Met' : 'Below Target' }}
                      </span>
                    </div>
                  </div>
                  <div class="relative">
                    <div class="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        class="h-2 rounded-full transition-all duration-500"
                        :class="getMetricBarClass(value, userMetrics.goals[metric])"
                        :style="{ width: `${Math.min(value, 100)}%` }"
                      ></div>
                    </div>
                    <!-- Goal indicator -->
                    <div 
                      class="absolute top-0 w-0.5 h-2 bg-gray-400"
                      :style="{ left: `${Math.min(userMetrics.goals[metric], 100)}%` }"
                    ></div>
                  </div>
                  <div class="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Goal: {{ userMetrics.goals[metric] }}%</span>
                    <span>{{ value >= userMetrics.goals[metric] ? '+' : '' }}{{ value - userMetrics.goals[metric] }}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Achievements & Streaks -->
      <div class="space-y-6">
        <!-- Recent Achievements -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200">
          <div class="p-6 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900">Recent Achievements</h3>
          </div>
          
          <div class="p-6">
            <div v-if="performanceStore.recentAchievements.length === 0" class="text-center py-4">
              <StarIcon class="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p class="text-gray-500">No achievements yet</p>
            </div>
            
            <div v-else class="space-y-3">
              <div
                v-for="achievement in performanceStore.recentAchievements"
                :key="achievement.id"
                class="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
              >
                <div 
                  class="w-10 h-10 rounded-lg flex items-center justify-center"
                  :class="getTierClass(achievement.tier)"
                >
                  <component :is="getAchievementIcon(achievement.icon)" class="w-5 h-5" />
                </div>
                <div class="flex-1">
                  <p class="text-sm font-medium text-gray-900">{{ achievement.name }}</p>
                  <p class="text-xs text-gray-600">{{ achievement.description }}</p>
                  <div class="flex items-center space-x-2 mt-1">
                    <span 
                      class="text-xs px-2 py-0.5 rounded-full"
                      :class="getRarityClass(achievement.rarity)"
                    >
                      {{ achievement.rarity }}
                    </span>
                    <span class="text-xs text-green-600 font-medium">+${{ achievement.bonusAmount }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Active Streaks -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200">
          <div class="p-6 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900">Active Streaks</h3>
          </div>
          
          <div class="p-6">
            <div v-if="performanceStore.activeStreaks.length === 0" class="text-center py-4">
              <FireIcon class="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p class="text-gray-500">No active streaks</p>
            </div>
            
            <div v-else class="space-y-3">
              <div
                v-for="streak in performanceStore.activeStreaks"
                :key="streak.id"
                class="p-3 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg border border-orange-200"
              >
                <div class="flex items-center justify-between mb-2">
                  <span class="text-sm font-medium text-gray-900 capitalize">{{ streak.type }} Streak</span>
                  <div class="flex items-center space-x-1">
                    <FireIcon class="w-4 h-4 text-orange-500" />
                    <span class="text-sm font-bold text-orange-600">{{ streak.currentStreak }} days</span>
                  </div>
                </div>
                <div class="flex justify-between text-xs text-gray-600">
                  <span>Best: {{ streak.bestStreak }} days</span>
                  <span>+${{ streak.bonusPerDay }}/day</span>
                </div>
                <div class="mt-2">
                  <div class="w-full bg-orange-200 rounded-full h-1">
                    <div 
                      class="bg-orange-500 h-1 rounded-full transition-all duration-300"
                      :style="{ width: `${Math.min((streak.currentStreak / streak.bestStreak) * 100, 100)}%` }"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Team Challenges -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <div class="p-6 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-900">Team Challenges</h3>
          <button
            @click="showChallengeModal = true"
            class="bg-primary-600 text-white px-3 py-1 rounded text-sm hover:bg-primary-700 transition-colors duration-200"
          >
            Join Challenge
          </button>
        </div>
      </div>
      
      <div class="p-6">
        <div v-if="performanceStore.activeChallenges.length === 0" class="text-center py-8">
          <UsersIcon class="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p class="text-gray-500">No active challenges</p>
        </div>

        <div v-else class="space-y-6">
          <div
            v-for="challenge in performanceStore.activeChallenges"
            :key="challenge.id"
            class="border border-gray-200 rounded-lg p-6"
          >
            <div class="flex items-start justify-between mb-4">
              <div>
                <h4 class="text-lg font-medium text-gray-900">{{ challenge.name }}</h4>
                <p class="text-gray-600">{{ challenge.description }}</p>
                <div class="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                  <span>{{ challenge.participants.length }} participants</span>
                  <span>{{ challenge.teams.length }} teams</span>
                  <span>Ends {{ formatDate(challenge.endDate) }}</span>
                </div>
              </div>
              <span 
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
              >
                {{ challenge.status.toUpperCase() }}
              </span>
            </div>

            <!-- Team Leaderboard -->
            <div class="space-y-2">
              <h5 class="text-sm font-medium text-gray-900">Team Leaderboard</h5>
              <div
                v-for="entry in challenge.leaderboard.slice(0, 3)"
                :key="entry.teamId"
                class="flex items-center justify-between p-3 bg-gray-50 rounded"
              >
                <div class="flex items-center space-x-3">
                  <div 
                    class="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold"
                    :style="{ backgroundColor: getTeamColor(entry.teamId, challenge.teams) }"
                  >
                    {{ entry.rank }}
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-900">{{ entry.teamName }}</p>
                    <p class="text-xs text-gray-600">{{ entry.members.length }} members</p>
                  </div>
                </div>
                <div class="text-right">
                  <p class="text-sm font-bold text-gray-900">{{ entry.score.toLocaleString() }}</p>
                  <div class="flex items-center space-x-1">
                    <component 
                      :is="getTrendIcon(entry.trend)" 
                      class="w-3 h-3"
                      :class="getTrendColor(entry.trend)"
                    />
                    <span class="text-xs text-gray-500">{{ entry.trend }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Rewards Preview -->
            <div class="mt-4 p-3 bg-blue-50 rounded">
              <h5 class="text-sm font-medium text-blue-900 mb-2">Rewards</h5>
              <div class="grid grid-cols-3 gap-2 text-xs">
                <div
                  v-for="reward in challenge.rewards.slice(0, 3)"
                  :key="reward.rank"
                  class="text-center"
                >
                  <div class="font-medium text-blue-800">{{ getOrdinal(reward.rank) }} Place</div>
                  <div class="text-blue-600">${{ reward.bonusAmount }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Seasonal Event -->
    <div v-if="performanceStore.currentSeasonalEvent" class="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg p-6 text-white">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-xl font-bold mb-2">🎉 {{ performanceStore.currentSeasonalEvent.name }}</h3>
          <p class="text-indigo-100">{{ performanceStore.currentSeasonalEvent.description }}</p>
          <div class="mt-3 flex items-center space-x-4 text-sm">
            <span>Bonus Multipliers Active</span>
            <span>Exclusive Rewards Available</span>
            <span>Ends {{ formatDate(performanceStore.currentSeasonalEvent.endDate) }}</span>
          </div>
        </div>
        <div class="text-right">
          <div class="text-2xl font-bold">${{ performanceStore.currentSeasonalEvent.participationReward }}</div>
          <div class="text-indigo-100">Participation Bonus</div>
        </div>
      </div>
    </div>

    <!-- Challenge Join Modal -->
    <div v-if="showChallengeModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Join Team Challenge</h3>
        
        <div class="space-y-4">
          <div
            v-for="challenge in performanceStore.upcomingChallenges"
            :key="challenge.id"
            class="border border-gray-200 rounded-lg p-4"
          >
            <h4 class="font-medium text-gray-900">{{ challenge.name }}</h4>
            <p class="text-sm text-gray-600 mb-3">{{ challenge.description }}</p>
            
            <div class="grid grid-cols-2 gap-4 mb-3">
              <div>
                <span class="text-xs text-gray-500">Start Date:</span>
                <p class="text-sm font-medium">{{ formatDate(challenge.startDate) }}</p>
              </div>
              <div>
                <span class="text-xs text-gray-500">Duration:</span>
                <p class="text-sm font-medium">{{ getDuration(challenge.startDate, challenge.endDate) }}</p>
              </div>
            </div>

            <div class="flex space-x-2">
              <button
                v-for="team in challenge.teams"
                :key="team.id"
                @click="joinTeam(challenge.id, team.id)"
                class="flex-1 p-2 border border-gray-300 rounded text-sm hover:bg-gray-50 transition-colors duration-200"
              >
                <div class="text-center">
                  <div class="font-medium">{{ team.name }}</div>
                  <div class="text-xs text-gray-500">{{ team.members.length }} members</div>
                </div>
              </button>
            </div>
          </div>
        </div>

        <div class="flex space-x-3 mt-6">
          <button
            @click="showChallengeModal = false"
            class="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors duration-200"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { format } from 'date-fns';
import { usePerformanceStore } from '../stores/performance';
import { useAuthStore } from '../stores/auth';
import {
  TrophyIcon,
  FireIcon,
  StarIcon,
  CurrencyDollarIcon,
  UsersIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  MinusIcon,
  LightBulbIcon,
  ShieldCheckIcon,
  ClockIcon
} from '@heroicons/vue/24/outline';

const performanceStore = usePerformanceStore();
const authStore = useAuthStore();
const showChallengeModal = ref(false);

const userMetrics = ref(performanceStore.userMetrics);

const formatMetricName = (metric: string) => {
  return metric.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
};

const getMetricStatusClass = (value: number, goal: number) => {
  if (value >= goal) return 'bg-green-100 text-green-800';
  if (value >= goal * 0.9) return 'bg-yellow-100 text-yellow-800';
  return 'bg-red-100 text-red-800';
};

const getMetricBarClass = (value: number, goal: number) => {
  if (value >= goal) return 'bg-green-500';
  if (value >= goal * 0.9) return 'bg-yellow-500';
  return 'bg-red-500';
};

const getTierClass = (tier: string) => {
  const classes = {
    'bronze': 'bg-amber-100 text-amber-700',
    'silver': 'bg-gray-100 text-gray-700',
    'gold': 'bg-yellow-100 text-yellow-700',
    'platinum': 'bg-blue-100 text-blue-700',
    'diamond': 'bg-purple-100 text-purple-700'
  };
  return classes[tier as keyof typeof classes] || classes.bronze;
};

const getRarityClass = (rarity: string) => {
  const classes = {
    'common': 'bg-gray-100 text-gray-600',
    'uncommon': 'bg-green-100 text-green-600',
    'rare': 'bg-blue-100 text-blue-600',
    'epic': 'bg-purple-100 text-purple-600',
    'legendary': 'bg-orange-100 text-orange-600'
  };
  return classes[rarity as keyof typeof classes] || classes.common;
};

const getAchievementIcon = (icon: string) => {
  const icons = {
    'trophy': TrophyIcon,
    'lightbulb': LightBulbIcon,
    'shield': ShieldCheckIcon,
    'users': UsersIcon,
    'star': StarIcon,
    'fire': FireIcon
  };
  return icons[icon as keyof typeof icons] || StarIcon;
};

const getTrendIcon = (trend: string) => {
  const icons = {
    'up': ChevronUpIcon,
    'down': ChevronDownIcon,
    'stable': MinusIcon
  };
  return icons[trend as keyof typeof icons] || MinusIcon;
};

const getTrendColor = (trend: string) => {
  const colors = {
    'up': 'text-green-500',
    'down': 'text-red-500',
    'stable': 'text-gray-500'
  };
  return colors[trend as keyof typeof colors] || colors.stable;
};

const getTeamColor = (teamId: string, teams: any[]) => {
  const team = teams.find(t => t.id === teamId);
  return team?.color || '#3b82f6';
};

const getOrdinal = (num: number) => {
  const ordinals = ['1st', '2nd', '3rd'];
  return ordinals[num - 1] || `${num}th`;
};

const formatDate = (dateString: string) => {
  return format(new Date(dateString), 'MMM dd, yyyy');
};

const getDuration = (start: string, end: string) => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  return `${days} days`;
};

const joinTeam = async (challengeId: string, teamId: string) => {
  await performanceStore.joinChallenge(challengeId, teamId);
  showChallengeModal.value = false;
};

onMounted(() => {
  if (authStore.user) {
    performanceStore.fetchUserMetrics(authStore.user.id);
    performanceStore.fetchAchievements(authStore.user.id);
    performanceStore.fetchTeamChallenges();
    performanceStore.fetchSeasonalEvents();
    performanceStore.fetchInsights(authStore.user.id);
    userMetrics.value = performanceStore.userMetrics;
  }
});
</script>