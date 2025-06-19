<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200">
    <div class="p-6 border-b border-gray-200">
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold text-gray-900">Compliance Alerts</h3>
        <span 
          class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"
        >
          {{ alerts.length }} Active
        </span>
      </div>
    </div>
    
    <div v-if="alerts.length === 0" class="p-6 text-center">
      <ShieldCheckIcon class="w-12 h-12 text-green-400 mx-auto mb-4" />
      <p class="text-gray-500">No compliance violations detected</p>
    </div>

    <div v-else class="divide-y divide-gray-200">
      <div
        v-for="alert in alerts"
        :key="alert.timestamp"
        class="p-6 hover:bg-gray-50 transition-colors duration-200"
      >
        <div class="flex items-start space-x-3">
          <div class="flex-shrink-0">
            <ExclamationTriangleIcon class="w-5 h-5 text-red-500" />
          </div>
          <div class="flex-1">
            <div class="flex items-center justify-between mb-2">
              <h4 class="text-sm font-medium text-gray-900">Access Denied</h4>
              <span class="text-xs text-gray-500">{{ formatTime(alert.timestamp) }}</span>
            </div>
            <p class="text-sm text-gray-700 mb-2">
              User attempted {{ alert.action }} on job {{ alert.jobId }}
            </p>
            <div class="space-y-1">
              <div v-for="rule in alert.rules" :key="rule" class="text-xs text-red-600">
                • {{ rule }}
              </div>
            </div>
            <div class="mt-3 flex items-center space-x-4 text-xs text-gray-500">
              <span>User: {{ alert.userId }}</span>
              <span v-if="alert.ipAddress">IP: {{ alert.ipAddress }}</span>
              <span v-if="alert.location">Location: {{ alert.location }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="alerts.length > 0" class="p-4 border-t border-gray-200">
      <button
        @click="$emit('view-all-alerts')"
        class="w-full text-center text-sm text-primary-600 hover:text-primary-700 font-medium"
      >
        View All Compliance Logs
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { format } from 'date-fns';
import type { ComplianceCheck } from '../types/integration';
import {
  ShieldCheckIcon,
  ExclamationTriangleIcon
} from '@heroicons/vue/24/outline';

interface Props {
  alerts: ComplianceCheck[];
}

defineProps<Props>();

defineEmits<{
  'view-all-alerts': [];
}>();

const formatTime = (timestamp: string) => {
  return format(new Date(timestamp), 'MMM dd, HH:mm');
};
</script>