<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200">
    <div class="p-6 border-b border-gray-200">
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold text-gray-900">Performance Leaderboard</h3>
        <div class="flex space-x-2">
          <select 
            v-model="selectedPeriod"
            @change="updateLeaderboard"
            class="text-sm border border-gray-300 rounded-md px-2 py-1 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
          </select>
          <select 
            v-model="selectedDepartment"
            @change="updateLeaderboard"
            class="text-sm border border-gray-300 rounded-md px-2 py-1 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">All Departments</option>
            <option value="cnc-machining">CNC Machining</option>
            <option value="quality-control">Quality Control</option>
            <option value="welding">Welding</option>
            <option value="assembly">Assembly</option>
          </select>
        </div>
      </div>
    </div>

    <div class="p-6">
      <div v-if="performanceStore.loading" class="space-y-3">
        <div v-for="i in 5" :key="i" class="animate-pulse">
          <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div class="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>

      <div v-else-if="performanceStore.leaderboard.length === 0" class="text-center py-8">
        <TrophyIcon class="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p class="text-gray-500">No leaderboard data available</p>
      </div>

      <div v-else class="space-y-3">
        <div
          v-for="(entry, index) in performanceStore.leaderboard"
          :key="entry.userId"
          class="flex items-center space-x-4 p-4 rounded-lg transition-colors duration-200"
          :class="getUserRowClass(entry.userId, index)"
        >
          <!-- Rank -->
          <div class="flex-shrink-0">
            <div 
              class="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white"
              :class="getRankClass(entry.rank)"
            >
              {{ entry.rank <= 3 ? getRankIcon(entry.rank) : entry.rank }}
            </div>
          </div>

          <!-- User Info -->
          <div class="flex-1">
            <div class="flex items-center space-x-2">
              <h4 class="font-medium text-gray-900">{{ entry.userName }}</h4>
              <span class="text-xs text-gray-500">Level {{ entry.level }}</span>
              <div class="flex items-center space-x-1">
                <component 
                  :is="getTrendIcon(entry.trend)" 
                  class="w-3 h-3"
                  :class="getTrendColor(entry.trend)"
                />
                <span class="text-xs text-gray-500">
                  {{ entry.previousRank ? Math.abs(entry.rank - entry.previousRank) : 0 }}
                </span>
              </div>
            </div>
            <div class="flex items-center space-x-4 text-sm text-gray-600">
              <span>{{ entry.department }}</span>
              <span>{{ entry.role }}</span>
            </div>
          </div>

          <!-- Stats -->
          <div class="text-right">
            <div class="text-lg font-bold text-gray-900">{{ entry.score }}</div>
            <div class="text-sm text-gray-600">score</div>
          </div>

          <!-- Achievements -->
          <div class="text-right">
            <div class="flex items-center space-x-2">
              <div class="flex items-center space-x-1">
                <StarIcon class="w-4 h-4 text-yellow-500" />
                <span class="text-sm font-medium text-gray-900">{{ entry.achievements }}</span>
              </div>
              <div class="flex items-center space-x-1">
                <FireIcon class="w-4 h-4 text-orange-500" />
                <span class="text-sm font-medium text-gray-900">{{ entry.streaks }}</span>
              </div>
            </div>
            <div class="text-sm text-green-600 font-medium">${{ entry.bonusEarned.toLocaleString() }}</div>
          </div>
        </div>
      </div>

      <!-- View Full Leaderboard -->
      <div v-if="performanceStore.leaderboard.length > 0" class="mt-6 text-center">
        <button
          @click="$emit('view-full-leaderboard')"
          class="text-primary-600 hover:text-primary-700 text-sm font-medium"
        >
          View Full Leaderboard
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { usePerformanceStore } from '../stores/performance.ts';
import { useAuthStore } from '../stores/auth.ts';
import {
  TrophyIcon,
  StarIcon,
  FireIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  MinusIcon
} from '@heroicons/vue/24/outline';

const performanceStore = usePerformanceStore();
const authStore = useAuthStore();

defineEmits<{
  'view-full-leaderboard': [];
}>();

const selectedPeriod = ref('monthly');
const selectedDepartment = ref('');

const getRankClass = (rank: number) => {
  if (rank === 1) return 'bg-gradient-to-r from-yellow-400 to-yellow-600';
  if (rank === 2) return 'bg-gradient-to-r from-gray-400 to-gray-600';
  if (rank === 3) return 'bg-gradient-to-r from-amber-600 to-amber-800';
  return 'bg-gray-500';
};

const getRankIcon = (rank: number) => {
  const icons = ['🥇', '🥈', '🥉'];
  return icons[rank - 1] || rank.toString();
};

const getUserRowClass = (userId: string, index: number) => {
  const isCurrentUser = userId === authStore.user?.id;
  const baseClass = index < 3 ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200' : 'hover:bg-gray-50';
  
  if (isCurrentUser) {
    return `${baseClass} ring-2 ring-primary-500 bg-primary-50`;
  }
  
  return baseClass;
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

const updateLeaderboard = () => {
  performanceStore.fetchLeaderboard();
};

onMounted(() => {
  performanceStore.fetchLeaderboard();
});
</script>