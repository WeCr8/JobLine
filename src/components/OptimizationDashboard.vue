<template>
  <div class="space-y-6">
    <!-- AI Insights Header -->
    <div class="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold mb-2">AI Manufacturing Insights</h2>
          <p class="text-blue-100">Intelligent optimization recommendations powered by machine learning</p>
        </div>
        <div class="text-right">
          <div class="text-3xl font-bold">${{ (optimizationStore.totalCostSavings / 1000).toFixed(1) }}K</div>
          <div class="text-blue-100">Potential Savings</div>
        </div>
      </div>
    </div>

    <!-- Key Metrics -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Setup Time Savings</p>
            <p class="text-2xl font-bold text-green-600">{{ optimizationStore.totalTimeSavings }}min</p>
          </div>
          <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <ClockIcon class="w-6 h-6 text-green-600" />
          </div>
        </div>
        <div class="mt-2">
          <span class="text-sm text-green-600 font-medium">+15% improvement</span>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Part Families</p>
            <p class="text-2xl font-bold text-blue-600">{{ Object.keys(optimizationStore.partFamilies).length }}</p>
          </div>
          <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <CubeIcon class="w-6 h-6 text-blue-600" />
          </div>
        </div>
        <div class="mt-2">
          <span class="text-sm text-blue-600 font-medium">{{ optimizationStore.partSimilarities.length }} parts analyzed</span>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Quality Issues</p>
            <p class="text-2xl font-bold text-orange-600">{{ optimizationStore.criticalQualityIssues.length }}</p>
          </div>
          <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
            <ExclamationTriangleIcon class="w-6 h-6 text-orange-600" />
          </div>
        </div>
        <div class="mt-2">
          <span class="text-sm text-orange-600 font-medium">Requires attention</span>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Engineering Alerts</p>
            <p class="text-2xl font-bold text-purple-600">{{ optimizationStore.openEngineeringAlerts.length }}</p>
          </div>
          <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <BeakerIcon class="w-6 h-6 text-purple-600" />
          </div>
        </div>
        <div class="mt-2">
          <span class="text-sm text-purple-600 font-medium">Open items</span>
        </div>
      </div>
    </div>

    <!-- Main Content Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Setup Optimizations -->
      <div class="lg:col-span-2">
        <div class="bg-white rounded-lg shadow-sm border border-gray-200">
          <div class="p-6 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold text-gray-900">Setup Optimization Opportunities</h3>
              <button
                @click="generateNewOptimization"
                :disabled="generatingOptimization"
                class="px-3 py-1 bg-primary-600 text-white rounded text-sm hover:bg-primary-700 disabled:opacity-50 transition-colors duration-200"
              >
                {{ generatingOptimization ? 'Analyzing...' : 'Analyze Job' }}
              </button>
            </div>
          </div>
          
          <div v-if="optimizationStore.loading" class="p-6">
            <div class="space-y-4">
              <div v-for="i in 3" :key="i" class="animate-pulse">
                <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div class="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </div>

          <div v-else-if="optimizationStore.setupOptimizations.length === 0" class="p-6 text-center">
            <LightBulbIcon class="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p class="text-gray-500">No optimization opportunities identified yet</p>
          </div>

          <div v-else class="divide-y divide-gray-200">
            <div
              v-for="optimization in optimizationStore.setupOptimizations"
              :key="optimization.id"
              class="p-6 hover:bg-gray-50 transition-colors duration-200"
            >
              <div class="flex items-start justify-between mb-4">
                <div>
                  <h4 class="text-lg font-medium text-gray-900">Job {{ optimization.jobId }}</h4>
                  <div class="flex items-center space-x-4 mt-1">
                    <span class="text-sm text-gray-600">
                      Current: {{ optimization.currentSetupTime }}min
                    </span>
                    <span class="text-sm text-green-600 font-medium">
                      Optimized: {{ optimization.optimizedSetupTime }}min
                    </span>
                    <span class="text-sm text-blue-600 font-medium">
                      Savings: {{ optimization.timeSavings }}min
                    </span>
                  </div>
                </div>
                <div class="text-right">
                  <div class="text-lg font-bold text-green-600">
                    ${{ optimization.estimatedROI.toLocaleString() }}
                  </div>
                  <div class="text-sm text-gray-500">Est. ROI</div>
                </div>
              </div>

              <div class="space-y-3">
                <div
                  v-for="suggestion in optimization.suggestions"
                  :key="suggestion.title"
                  class="bg-gray-50 rounded-lg p-4"
                >
                  <div class="flex items-start justify-between mb-2">
                    <h5 class="font-medium text-gray-900">{{ suggestion.title }}</h5>
                    <span 
                      class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                      :class="getImpactClass(suggestion.impact)"
                    >
                      {{ suggestion.impact.toUpperCase() }} IMPACT
                    </span>
                  </div>
                  <p class="text-sm text-gray-700 mb-3">{{ suggestion.description }}</p>
                  <div class="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span class="text-gray-500">Time Savings:</span>
                      <span class="font-medium text-green-600 ml-1">{{ suggestion.timeSavings }}min</span>
                    </div>
                    <div>
                      <span class="text-gray-500">Cost Savings:</span>
                      <span class="font-medium text-green-600 ml-1">${{ suggestion.costSavings }}</span>
                    </div>
                  </div>
                  <div class="mt-2">
                    <span class="text-gray-500 text-sm">Implementation:</span>
                    <p class="text-sm text-gray-700">{{ suggestion.implementation }}</p>
                  </div>
                </div>
              </div>

              <div class="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                <div class="flex items-center space-x-4 text-sm text-gray-600">
                  <span>Confidence: {{ Math.round(optimization.confidence * 100) }}%</span>
                  <span>Difficulty: {{ optimization.implementationDifficulty }}</span>
                </div>
                <div class="flex space-x-2">
                  <button class="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200 transition-colors duration-200">
                    View Details
                  </button>
                  <button class="px-3 py-1 bg-primary-600 text-white rounded text-sm hover:bg-primary-700 transition-colors duration-200">
                    Implement
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Part Families -->
      <div>
        <div class="bg-white rounded-lg shadow-sm border border-gray-200">
          <div class="p-6 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900">Similar Parts</h3>
          </div>
          
          <div class="p-6 space-y-4">
            <div
              v-for="(family, groupId) in optimizationStore.partFamilies"
              :key="groupId"
              class="border border-gray-200 rounded-lg p-4"
            >
              <h4 class="font-medium text-gray-900 mb-3">
                Part Family {{ groupId }} ({{ family.length }} parts)
              </h4>
              <div class="space-y-2">
                <div
                  v-for="part in family.slice(0, 3)"
                  :key="part.id"
                  class="flex items-center justify-between text-sm"
                >
                  <div>
                    <span class="font-medium text-gray-900">{{ part.partNumber }}</span>
                    <p class="text-gray-600">{{ part.material }}</p>
                  </div>
                  <div class="text-right">
                    <div class="text-gray-900">{{ part.setupTime }}min</div>
                    <div class="text-gray-500">setup</div>
                  </div>
                </div>
              </div>
              <div class="mt-3 pt-3 border-t border-gray-200">
                <div class="flex items-center justify-between text-sm">
                  <span class="text-gray-600">Avg Setup Time:</span>
                  <span class="font-medium text-gray-900">
                    {{ Math.round(family.reduce((sum, p) => sum + p.setupTime, 0) / family.length) }}min
                  </span>
                </div>
                <div class="flex items-center justify-between text-sm mt-1">
                  <span class="text-gray-600">Fixture Type:</span>
                  <span class="font-medium text-gray-900">{{ family[0]?.fixtureType }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Production Trends -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <div class="p-6 border-b border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900">Production Trends & Insights</h3>
      </div>
      
      <div class="p-6">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div
            v-for="trend in optimizationStore.productionTrends"
            :key="trend.id"
            class="border border-gray-200 rounded-lg p-4"
          >
            <div class="flex items-center justify-between mb-4">
              <h4 class="font-medium text-gray-900 capitalize">{{ trend.metric.replace('-', ' ') }}</h4>
              <div class="flex items-center space-x-2">
                <span 
                  class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                  :class="getTrendClass(trend.trend)"
                >
                  {{ trend.trend.toUpperCase() }}
                </span>
                <span class="text-sm font-medium text-gray-900">
                  {{ trend.changePercent > 0 ? '+' : '' }}{{ trend.changePercent }}%
                </span>
              </div>
            </div>

            <div class="space-y-2 mb-4">
              <div
                v-for="insight in trend.insights"
                :key="insight"
                class="text-sm text-gray-700 flex items-start space-x-2"
              >
                <div class="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>{{ insight }}</span>
              </div>
            </div>

            <!-- Mini trend chart -->
            <div class="h-20 bg-gray-50 rounded flex items-end space-x-1 p-2">
              <div
                v-for="(point, index) in trend.data"
                :key="index"
                class="flex-1 bg-blue-500 rounded-t"
                :style="{ height: `${(point.value / Math.max(...trend.data.map(d => d.value))) * 100}%` }"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useOptimizationStore } from '../stores/optimization';
import {
  ClockIcon,
  CubeIcon,
  ExclamationTriangleIcon,
  BeakerIcon,
  LightBulbIcon
} from '@heroicons/vue/24/outline';

const optimizationStore = useOptimizationStore();
const generatingOptimization = ref(false);

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
    'improving': 'bg-green-100 text-green-800',
    'declining': 'bg-red-100 text-red-800',
    'stable': 'bg-gray-100 text-gray-800'
  };
  return classes[trend as keyof typeof classes] || classes.stable;
};

const generateNewOptimization = async () => {
  generatingOptimization.value = true;
  try {
    await optimizationStore.generateSetupOptimization('sample-job-id');
  } finally {
    generatingOptimization.value = false;
  }
};

onMounted(() => {
  optimizationStore.fetchPartSimilarities();
  optimizationStore.fetchSetupOptimizations();
  optimizationStore.fetchProductionTrends();
  optimizationStore.fetchQualityInsights();
  optimizationStore.fetchEngineeringAlerts();
});
</script>