<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Performance Plus</h1>
        <p class="text-gray-600">Track your performance, earn rewards, and compete with your team</p>
      </div>
      <div class="flex space-x-3">
        <button
          @click="showInnovationModal = true"
          class="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors duration-200"
        >
          Submit Innovation
        </button>
        <button
          @click="showInsightsModal = true"
          class="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors duration-200"
        >
          View Insights
        </button>
      </div>
    </div>

    <!-- Main Dashboard -->
    <PerformanceDashboard />

    <!-- Secondary Content Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Leaderboard -->
      <LeaderboardWidget @view-full-leaderboard="showLeaderboardModal = true" />

      <!-- Innovation Submissions -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200">
        <div class="p-6 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900">Innovation Hub</h3>
        </div>
        
        <div class="p-6">
          <div v-if="performanceStore.innovations.length === 0" class="text-center py-8">
            <LightBulbIcon class="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p class="text-gray-500">No innovations submitted yet</p>
            <button
              @click="showInnovationModal = true"
              class="mt-2 text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              Submit your first innovation
            </button>
          </div>

          <div v-else class="space-y-4">
            <div
              v-for="innovation in performanceStore.innovations.slice(0, 3)"
              :key="innovation.id"
              class="border border-gray-200 rounded-lg p-4"
            >
              <div class="flex items-start justify-between mb-2">
                <h4 class="font-medium text-gray-900">{{ innovation.title }}</h4>
                <span 
                  class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                  :class="getInnovationStatusClass(innovation.status)"
                >
                  {{ innovation.status.replace('-', ' ').toUpperCase() }}
                </span>
              </div>
              <p class="text-sm text-gray-600 mb-3">{{ innovation.description }}</p>
              <div class="flex items-center justify-between text-sm">
                <span class="text-gray-500">Est. Savings: ${{ innovation.estimatedSavings.toLocaleString() }}</span>
                <span class="text-green-600 font-medium">Bonus: ${{ innovation.bonusAwarded }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Innovation Submission Modal -->
    <div v-if="showInnovationModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Submit Innovation</h3>
        
        <form @submit.prevent="submitInnovation" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Title</label>
            <input
              v-model="innovationForm.title"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              placeholder="Brief title for your innovation"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              v-model="innovationForm.category"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="process-improvement">Process Improvement</option>
              <option value="cost-reduction">Cost Reduction</option>
              <option value="safety-enhancement">Safety Enhancement</option>
              <option value="quality-improvement">Quality Improvement</option>
              <option value="efficiency-boost">Efficiency Boost</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              v-model="innovationForm.description"
              rows="4"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              placeholder="Detailed description of your innovation and how it works"
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Estimated Annual Savings ($)</label>
            <input
              v-model.number="innovationForm.estimatedSavings"
              type="number"
              min="0"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              placeholder="0"
            />
          </div>

          <div class="flex space-x-3 mt-6">
            <button
              type="submit"
              class="flex-1 bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700 transition-colors duration-200"
            >
              Submit Innovation
            </button>
            <button
              type="button"
              @click="showInnovationModal = false"
              class="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors duration-200"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Performance Insights Modal -->
    <div v-if="showInsightsModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-semibold text-gray-900">Performance Insights</h3>
          <button
            @click="showInsightsModal = false"
            class="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon class="w-6 h-6" />
          </button>
        </div>
        
        <div class="space-y-4">
          <div
            v-for="insight in performanceStore.insights"
            :key="insight.id"
            class="border border-gray-200 rounded-lg p-4"
          >
            <div class="flex items-start justify-between mb-3">
              <div>
                <h4 class="font-medium text-gray-900">{{ insight.title }}</h4>
                <span 
                  class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium mt-1"
                  :class="getInsightTypeClass(insight.type)"
                >
                  {{ insight.type.replace('-', ' ').toUpperCase() }}
                </span>
              </div>
              <div class="text-right">
                <div class="text-lg font-bold text-green-600">${{ insight.potentialBonus }}</div>
                <div class="text-xs text-gray-500">Potential Bonus</div>
              </div>
            </div>
            
            <p class="text-gray-700 mb-3">{{ insight.description }}</p>
            
            <div class="space-y-2">
              <h5 class="text-sm font-medium text-gray-900">Action Items:</h5>
              <ul class="space-y-1">
                <li
                  v-for="action in insight.actionItems"
                  :key="action"
                  class="text-sm text-gray-700 flex items-start space-x-2"
                >
                  <div class="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>{{ action }}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Full Leaderboard Modal -->
    <div v-if="showLeaderboardModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-semibold text-gray-900">Full Leaderboard</h3>
          <button
            @click="showLeaderboardModal = false"
            class="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon class="w-6 h-6" />
          </button>
        </div>
        
        <LeaderboardWidget />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { usePerformanceStore } from '../stores/performance.ts';
import { useAuthStore } from '../stores/auth.ts';
import PerformanceDashboard from '../components/PerformanceDashboard.vue';
import LeaderboardWidget from '../components/LeaderboardWidget.vue';
import {
  LightBulbIcon,
  XMarkIcon
} from '@heroicons/vue/24/outline';

const performanceStore = usePerformanceStore();
const authStore = useAuthStore();

const showInnovationModal = ref(false);
const showInsightsModal = ref(false);
const showLeaderboardModal = ref(false);

const innovationForm = reactive({
  title: '',
  category: 'process-improvement' as any,
  description: '',
  estimatedSavings: 0
});

const getInnovationStatusClass = (status: string) => {
  const classes = {
    'pending': 'bg-yellow-100 text-yellow-800',
    'under-review': 'bg-blue-100 text-blue-800',
    'approved': 'bg-green-100 text-green-800',
    'implemented': 'bg-purple-100 text-purple-800',
    'rejected': 'bg-red-100 text-red-800'
  };
  return classes[status as keyof typeof classes] || classes.pending;
};

const getInsightTypeClass = (type: string) => {
  const classes = {
    'strength': 'bg-green-100 text-green-800',
    'improvement': 'bg-yellow-100 text-yellow-800',
    'opportunity': 'bg-blue-100 text-blue-800',
    'risk': 'bg-red-100 text-red-800'
  };
  return classes[type as keyof typeof classes] || classes.opportunity;
};

const submitInnovation = async () => {
  if (!authStore.user) return;
  
  await performanceStore.submitInnovation({
    userId: authStore.user.id,
    title: innovationForm.title,
    description: innovationForm.description,
    category: innovationForm.category,
    estimatedSavings: innovationForm.estimatedSavings,
    reviewers: [],
    bonusAwarded: 0,
    recognitionLevel: 'department',
    attachments: []
  });
  
  showInnovationModal.value = false;
  
  // Reset form
  Object.assign(innovationForm, {
    title: '',
    category: 'process-improvement',
    description: '',
    estimatedSavings: 0
  });
};

onMounted(() => {
  if (authStore.user) {
    performanceStore.fetchUserMetrics();
    performanceStore.fetchAchievements();
    performanceStore.fetchTeamChallenges();
    performanceStore.fetchBonusStructures();
    performanceStore.fetchLeaderboard();
    performanceStore.fetchSeasonalEvents();
    performanceStore.fetchInsights();
  }
});
</script>