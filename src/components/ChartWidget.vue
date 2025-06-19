<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200">
    <div class="p-4 border-b border-gray-200">
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold text-gray-900">{{ title }}</h3>
        <div class="flex items-center space-x-2">
          <select
            v-model="selectedChartType"
            @change="updateChartType"
            class="text-sm border border-gray-300 rounded-md px-2 py-1 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="bar">Bar Chart</option>
            <option value="line">Line Chart</option>
            <option value="doughnut">Doughnut</option>
            <option value="pie">Pie Chart</option>
          </select>
          <button
            @click="refreshData"
            class="p-1 text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <ArrowPathIcon class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
    <div class="p-6">
      <div class="relative" style="height: 300px;">
        <Bar
          v-if="selectedChartType === 'bar'"
          :data="chartData"
          :options="chartOptions"
        />
        <Line
          v-else-if="selectedChartType === 'line'"
          :data="chartData"
          :options="chartOptions"
        />
        <Doughnut
          v-else-if="selectedChartType === 'doughnut'"
          :data="chartData"
          :options="doughnutOptions"
        />
        <Pie
          v-else-if="selectedChartType === 'pie'"
          :data="chartData"
          :options="doughnutOptions"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Bar, Line, Doughnut, Pie } from 'vue-chartjs';
import { ArrowPathIcon } from '@heroicons/vue/24/outline';
import type { ChartType, ChartData } from '../types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface Props {
  title: string;
  data: ChartData;
  defaultType?: ChartType;
}

const props = withDefaults(defineProps<Props>(), {
  defaultType: 'bar'
});

const emit = defineEmits<{
  'chart-type-changed': [type: ChartType];
  'refresh': [];
}>();

const selectedChartType = ref<ChartType>(props.defaultType);

const chartData = computed(() => ({
  labels: props.data.labels,
  datasets: props.data.datasets.map(dataset => ({
    ...dataset,
    backgroundColor: selectedChartType.value === 'bar' || selectedChartType.value === 'line'
      ? dataset.backgroundColor || '#3b82f6'
      : generateColors(props.data.labels.length),
    borderColor: selectedChartType.value === 'line'
      ? dataset.borderColor || '#2563eb'
      : undefined,
    borderWidth: selectedChartType.value === 'line' ? 2 : 1,
    fill: selectedChartType.value === 'line' ? false : undefined,
    tension: selectedChartType.value === 'line' ? 0.4 : undefined
  }))
}));

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: selectedChartType.value !== 'bar',
      position: 'bottom' as const
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      titleColor: '#fff',
      bodyColor: '#fff',
      borderColor: '#374151',
      borderWidth: 1
    }
  },
  scales: selectedChartType.value === 'bar' || selectedChartType.value === 'line' ? {
    x: {
      grid: {
        display: false
      }
    },
    y: {
      beginAtZero: true,
      grid: {
        color: '#f3f4f6'
      }
    }
  } : undefined
}));

const doughnutOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom' as const
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      titleColor: '#fff',
      bodyColor: '#fff'
    }
  }
}));

const generateColors = (count: number) => {
  const colors = [
    '#3b82f6', '#ef4444', '#10b981', '#f59e0b',
    '#8b5cf6', '#06b6d4', '#84cc16', '#f97316',
    '#ec4899', '#6366f1'
  ];
  return Array.from({ length: count }, (_, i) => colors[i % colors.length]);
};

const updateChartType = () => {
  emit('chart-type-changed', selectedChartType.value);
};

const refreshData = () => {
  emit('refresh');
};

watch(() => props.defaultType, (newType) => {
  selectedChartType.value = newType;
});
</script>