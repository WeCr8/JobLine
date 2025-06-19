<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    <!-- Header -->
    <div class="flex items-start justify-between mb-4">
      <div class="flex items-center space-x-3">
        <div 
          class="w-10 h-10 rounded-lg flex items-center justify-center"
          :class="getConnectionTypeColor(connection.type)"
        >
          <component :is="getConnectionIcon(connection.type)" class="w-5 h-5" />
        </div>
        <div>
          <h3 class="text-lg font-semibold text-gray-900">{{ connection.name }}</h3>
          <p class="text-sm text-gray-600">{{ getConnectionTypeLabel(connection.type) }}</p>
        </div>
      </div>
      <div class="flex items-center space-x-2">
        <span 
          class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
          :class="getStatusClass(connection.status)"
        >
          {{ connection.status.toUpperCase() }}
        </span>
        <span 
          class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
          :class="getComplianceClass(connection.complianceLevel)"
        >
          {{ connection.complianceLevel.toUpperCase() }}
        </span>
      </div>
    </div>

    <!-- Status Indicator -->
    <div class="mb-4">
      <div class="flex items-center space-x-2">
        <div 
          class="w-3 h-3 rounded-full"
          :class="getStatusDot(connection.status)"
        ></div>
        <span class="text-sm text-gray-600">
          {{ getStatusText(connection.status) }}
        </span>
      </div>
    </div>

    <!-- Connection Details -->
    <div class="space-y-3 mb-4">
      <div v-if="connection.lastSync">
        <span class="text-sm text-gray-500">Last Sync:</span>
        <p class="text-sm font-medium text-gray-900">{{ formatTime(connection.lastSync) }}</p>
      </div>
      <div v-if="connection.config.pollInterval">
        <span class="text-sm text-gray-500">Poll Interval:</span>
        <p class="text-sm font-medium text-gray-900">{{ formatInterval(connection.config.pollInterval) }}</p>
      </div>
      <div v-if="connection.errorCount > 0">
        <span class="text-sm text-gray-500">Error Count:</span>
        <p class="text-sm font-medium text-red-600">{{ connection.errorCount }}</p>
      </div>
    </div>

    <!-- Configuration Preview -->
    <div class="bg-gray-50 rounded-lg p-3 mb-4">
      <h4 class="text-sm font-medium text-gray-900 mb-2">Configuration</h4>
      <div class="space-y-1">
        <div v-if="connection.config.baseUrl">
          <span class="text-xs text-gray-500">API URL:</span>
          <p class="text-xs font-mono text-gray-700">{{ connection.config.baseUrl }}</p>
        </div>
        <div v-if="connection.config.spreadsheetId">
          <span class="text-xs text-gray-500">Spreadsheet:</span>
          <p class="text-xs font-mono text-gray-700">{{ connection.config.sheetName }}</p>
        </div>
        <div v-if="connection.config.sapHost">
          <span class="text-xs text-gray-500">SAP Host:</span>
          <p class="text-xs font-mono text-gray-700">{{ connection.config.sapHost }}</p>
        </div>
        <div v-if="connection.config.host">
          <span class="text-xs text-gray-500">SFTP Host:</span>
          <p class="text-xs font-mono text-gray-700">{{ connection.config.host }}</p>
        </div>
      </div>
    </div>

    <!-- Actions -->
    <div class="flex space-x-2">
      <button
        @click="$emit('test-connection', connection.id)"
        :disabled="testing"
        class="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-200 disabled:opacity-50 transition-colors duration-200"
      >
        {{ testing ? 'Testing...' : 'Test Connection' }}
      </button>
      <button
        @click="$emit('run-import', connection.id)"
        :disabled="connection.status !== 'active'"
        class="flex-1 bg-primary-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-primary-700 disabled:opacity-50 transition-colors duration-200"
      >
        Run Import
      </button>
      <button
        @click="$emit('edit-connection', connection.id)"
        class="px-3 py-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
      >
        <CogIcon class="w-4 h-4" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { format } from 'date-fns';
import type { ConnectionConfig, ConnectionType } from '../types/integration';
import {
  CloudIcon,
  DocumentArrowUpIcon,
  GlobeAltIcon,
  CircleStackIcon,
  BuildingOfficeIcon,
  BoltIcon,
  ServerIcon,
  CogIcon
} from '@heroicons/vue/24/outline';

interface Props {
  connection: ConnectionConfig;
}

defineProps<Props>();

defineEmits<{
  'test-connection': [connectionId: string];
  'run-import': [connectionId: string];
  'edit-connection': [connectionId: string];
}>();

const testing = ref(false);

const getConnectionIcon = (type: ConnectionType) => {
  const icons = {
    'google-sheets': CloudIcon,
    'csv-upload': DocumentArrowUpIcon,
    'rest-api': GlobeAltIcon,
    'sql-odbc': CircleStackIcon,
    'sap-bapi': BuildingOfficeIcon,
    'webhook': BoltIcon,
    'sftp': ServerIcon
  };
  return icons[type] || GlobeAltIcon;
};

const getConnectionTypeColor = (type: ConnectionType) => {
  const colors = {
    'google-sheets': 'bg-green-100 text-green-600',
    'csv-upload': 'bg-blue-100 text-blue-600',
    'rest-api': 'bg-purple-100 text-purple-600',
    'sql-odbc': 'bg-orange-100 text-orange-600',
    'sap-bapi': 'bg-indigo-100 text-indigo-600',
    'webhook': 'bg-yellow-100 text-yellow-600',
    'sftp': 'bg-gray-100 text-gray-600'
  };
  return colors[type] || 'bg-gray-100 text-gray-600';
};

const getConnectionTypeLabel = (type: ConnectionType) => {
  const labels = {
    'google-sheets': 'Google Sheets API',
    'csv-upload': 'CSV File Upload',
    'rest-api': 'REST API',
    'sql-odbc': 'SQL/ODBC Connection',
    'sap-bapi': 'SAP BAPI Connector',
    'webhook': 'Webhook Listener',
    'sftp': 'SFTP File Drop'
  };
  return labels[type] || type;
};

const getStatusClass = (status: string) => {
  const classes = {
    'active': 'bg-green-100 text-green-800',
    'inactive': 'bg-gray-100 text-gray-800',
    'error': 'bg-red-100 text-red-800',
    'testing': 'bg-yellow-100 text-yellow-800'
  };
  return classes[status as keyof typeof classes] || classes.inactive;
};

const getComplianceClass = (level: string) => {
  const classes = {
    'basic': 'bg-gray-100 text-gray-800',
    'itar': 'bg-red-100 text-red-800',
    'ear': 'bg-orange-100 text-orange-800',
    'cmmc-2': 'bg-blue-100 text-blue-800',
    'cmmc-3': 'bg-purple-100 text-purple-800'
  };
  return classes[level as keyof typeof classes] || classes.basic;
};

const getStatusDot = (status: string) => {
  const classes = {
    'active': 'bg-green-500 animate-pulse',
    'inactive': 'bg-gray-400',
    'error': 'bg-red-500',
    'testing': 'bg-yellow-500 animate-pulse'
  };
  return classes[status as keyof typeof classes] || classes.inactive;
};

const getStatusText = (status: string) => {
  const texts = {
    'active': 'Connected and syncing',
    'inactive': 'Connection disabled',
    'error': 'Connection failed',
    'testing': 'Testing connection'
  };
  return texts[status as keyof typeof texts] || 'Unknown status';
};

const formatTime = (timestamp: string) => {
  return format(new Date(timestamp), 'MMM dd, HH:mm');
};

const formatInterval = (ms: number) => {
  const minutes = Math.floor(ms / 60000);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h ${minutes % 60}m`;
};
</script>