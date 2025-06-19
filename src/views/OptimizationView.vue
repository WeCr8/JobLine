<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">AI Optimization</h1>
        <p class="text-gray-600">Intelligent manufacturing insights and recommendations</p>
      </div>
      <div class="flex space-x-3">
        <button
          @click="showAnalysisModal = true"
          class="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors duration-200"
        >
          Run Analysis
        </button>
        <button
          @click="exportInsights"
          class="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors duration-200"
        >
          Export Insights
        </button>
      </div>
    </div>

    <!-- Main Dashboard -->
    <OptimizationDashboard />

    <!-- Department-Specific Sections -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Voice & Media Tools -->
      <div class="space-y-6">
        <VoiceRecorder :job-id="selectedJobId" />
        <MediaUploader :job-id="selectedJobId" />
      </div>

      <!-- Quality & Engineering Insights -->
      <div class="space-y-6">
        <!-- Quality Insights -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200">
          <div class="p-6 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900">Quality Insights</h3>
          </div>
          
          <div v-if="optimizationStore.qualityInsights.length === 0" class="p-6 text-center">
            <ExclamationTriangleIcon class="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p class="text-gray-500">No quality issues detected</p>
          </div>

          <div v-else class="divide-y divide-gray-200">
            <div
              v-for="insight in optimizationStore.qualityInsights"
              :key="insight.id"
              class="p-6 hover:bg-gray-50 transition-colors duration-200"
            >
              <div class="flex items-start justify-between mb-3">
                <div>
                  <h4 class="font-medium text-gray-900">{{ insight.partNumber }}</h4>
                  <p class="text-sm text-gray-600">{{ insight.issueType }}</p>
                </div>
                <div class="flex items-center space-x-2">
                  <span 
                    class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                    :class="getImpactClass(insight.impact)"
                  >
                    {{ insight.impact.toUpperCase() }}
                  </span>
                  <span 
                    class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                    :class="getTrendClass(insight.trend)"
                  >
                    {{ insight.trend.toUpperCase() }}
                  </span>
                </div>
              </div>

              <div class="mb-3">
                <span class="text-sm text-gray-500">Frequency:</span>
                <span class="text-sm font-medium text-gray-900 ml-1">{{ insight.frequency }} occurrences</span>
              </div>

              <div v-if="insight.rootCause" class="mb-3">
                <span class="text-sm text-gray-500">Root Cause:</span>
                <p class="text-sm text-gray-700">{{ insight.rootCause }}</p>
              </div>

              <div class="space-y-1">
                <span class="text-sm font-medium text-gray-900">Recommendations:</span>
                <ul class="text-sm text-gray-700 space-y-1">
                  <li
                    v-for="rec in insight.recommendations"
                    :key="rec"
                    class="flex items-start space-x-2"
                  >
                    <div class="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>{{ rec }}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <!-- Engineering Alerts -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200">
          <div class="p-6 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900">Engineering Alerts</h3>
          </div>
          
          <div v-if="optimizationStore.engineeringAlerts.length === 0" class="p-6 text-center">
            <BeakerIcon class="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p class="text-gray-500">No engineering alerts</p>
          </div>

          <div v-else class="divide-y divide-gray-200">
            <div
              v-for="alert in optimizationStore.engineeringAlerts"
              :key="alert.id"
              class="p-6 hover:bg-gray-50 transition-colors duration-200"
            >
              <div class="flex items-start justify-between mb-3">
                <div>
                  <h4 class="font-medium text-gray-900">{{ alert.title }}</h4>
                  <p class="text-sm text-gray-600">{{ alert.description }}</p>
                </div>
                <div class="flex items-center space-x-2">
                  <span 
                    class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                    :class="getPriorityClass(alert.priority)"
                  >
                    {{ alert.priority.toUpperCase() }}
                  </span>
                  <span 
                    class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                    :class="getStatusClass(alert.status)"
                  >
                    {{ alert.status.toUpperCase() }}
                  </span>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-4 text-sm mb-3">
                <div>
                  <span class="text-gray-500">Type:</span>
                  <span class="font-medium text-gray-900 ml-1 capitalize">
                    {{ alert.type.replace('-', ' ') }}
                  </span>
                </div>
                <div v-if="alert.dueDate">
                  <span class="text-gray-500">Due:</span>
                  <span class="font-medium text-gray-900 ml-1">{{ formatDate(alert.dueDate) }}</span>
                </div>
              </div>

              <div v-if="alert.affectedParts.length > 0" class="mb-3">
                <span class="text-sm text-gray-500">Affected Parts:</span>
                <div class="flex flex-wrap gap-1 mt-1">
                  <span
                    v-for="part in alert.affectedParts"
                    :key="part"
                    class="inline-flex items-center px-2 py-0.5 rounded bg-gray-100 text-gray-800 text-xs"
                  >
                    {{ part }}
                  </span>
                </div>
              </div>

              <div class="flex space-x-2">
                <button class="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200 transition-colors duration-200">
                  View Details
                </button>
                <button
                  v-if="alert.status === 'open'"
                  class="px-3 py-1 bg-primary-600 text-white rounded text-sm hover:bg-primary-700 transition-colors duration-200"
                >
                  Assign
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Analysis Modal -->
    <div v-if="showAnalysisModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Run AI Analysis</h3>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Analysis Type</label>
            <select 
              v-model="analysisType"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="setup-optimization">Setup Optimization</option>
              <option value="part-similarity">Part Similarity Analysis</option>
              <option value="quality-trends">Quality Trend Analysis</option>
              <option value="production-efficiency">Production Efficiency</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Target Job (Optional)</label>
            <input
              v-model="selectedJobId"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              placeholder="J2024-001"
            />
          </div>
        </div>

        <div class="flex space-x-3 mt-6">
          <button
            @click="runAnalysis"
            :disabled="runningAnalysis"
            class="flex-1 bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700 disabled:opacity-50 transition-colors duration-200"
          >
            {{ runningAnalysis ? 'Analyzing...' : 'Run Analysis' }}
          </button>
          <button
            @click="showAnalysisModal = false"
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
import { useOptimizationStore } from '../stores/optimization';
import OptimizationDashboard from '../components/OptimizationDashboard.vue';
import VoiceRecorder from '../components/VoiceRecorder.vue';
import MediaUploader from '../components/MediaUploader.vue';
import {
  ExclamationTriangleIcon,
  BeakerIcon
} from '@heroicons/vue/24/outline';

const optimizationStore = useOptimizationStore();
const showAnalysisModal = ref(false);
const runningAnalysis = ref(false);
const analysisType = ref('setup-optimization');
const selectedJobId = ref('');

const getImpactClass = (impact: string) => {
  const classes = {
    'low': 'bg-gray-100 text-gray-800',
    'medium': 'bg-yellow-100 text-yellow-800',
    'high': 'bg-red-100 text-red-800'
  };
  return classes[impact as keyof typeof classes] || classes.low;
};

const getTrendClass = (trend: string) => {
  const classes = {
    'increasing': 'bg-red-100 text-red-800',
    'decreasing': 'bg-green-100 text-green-800',
    'stable': 'bg-gray-100 text-gray-800'
  };
  return classes[trend as keyof typeof classes] || classes.stable;
};

const getPriorityClass = (priority: string) => {
  const classes = {
    'low': 'bg-gray-100 text-gray-800',
    'medium': 'bg-yellow-100 text-yellow-800',
    'high': 'bg-orange-100 text-orange-800',
    'critical': 'bg-red-100 text-red-800'
  };
  return classes[priority as keyof typeof classes] || classes.low;
};

const getStatusClass = (status: string) => {
  const classes = {
    'open': 'bg-red-100 text-red-800',
    'in-progress': 'bg-yellow-100 text-yellow-800',
    'resolved': 'bg-green-100 text-green-800',
    'closed': 'bg-gray-100 text-gray-800'
  };
  return classes[status as keyof typeof classes] || classes.open;
};

const formatDate = (dateString: string) => {
  return format(new Date(dateString), 'MMM dd, yyyy');
};

const runAnalysis = async () => {
  runningAnalysis.value = true;
  
  try {
    switch (analysisType.value) {
      case 'setup-optimization':
        await optimizationStore.generateSetupOptimization(selectedJobId.value || 'sample-job');
        break;
      case 'part-similarity':
        await optimizationStore.analyzePartSimilarity(selectedJobId.value || 'PN-12345');
        break;
      default:
        // Simulate other analysis types
        await new Promise(resolve => setTimeout(resolve, 3000));
    }
  } finally {
    runningAnalysis.value = false;
    showAnalysisModal.value = false;
  }
};

const exportInsights = () => {
  // Would implement export functionality
  console.log('Exporting insights...');
};

onMounted(() => {
  optimizationStore.fetchQualityInsights();
  optimizationStore.fetchEngineeringAlerts();
});
</script>