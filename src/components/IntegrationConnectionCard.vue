<template>
  <div class="connection-card" :class="{ 'connection-card-disabled': disabled }">
    <!-- Header -->
    <div class="connection-card-header">
      <div class="connection-card-icon-container">
        <div 
          class="connection-card-icon"
          :class="getConnectionTypeColor(connection.type)"
        >
          <component :is="getConnectionIcon(connection.type)" class="w-5 h-5" />
        </div>
      </div>
      
      <div class="connection-card-title-container">
        <h3 class="connection-card-title">{{ connection.name }}</h3>
        <p class="connection-card-subtitle">{{ getConnectionTypeLabel(connection.type) }}</p>
      </div>
      
      <div class="connection-card-badges">
        <span 
          class="connection-card-badge"
          :class="getStatusClass(connection.status)"
        >
          {{ connection.status.toUpperCase() }}
        </span>
        <span 
          v-if="connection.complianceLevel"
          class="connection-card-badge"
          :class="getComplianceClass(connection.complianceLevel)"
        >
          {{ connection.complianceLevel.toUpperCase() }}
        </span>
      </div>
    </div>
    
    <!-- Status Indicator -->
    <div class="connection-card-status">
      <div class="connection-card-status-indicator">
        <div 
          class="connection-card-status-dot"
          :class="getStatusDot(connection.status)"
        ></div>
        <span class="connection-card-status-text">
          {{ getStatusText(connection.status) }}
        </span>
      </div>
      
      <div v-if="connection.lastSync" class="connection-card-last-sync">
        Last sync: {{ formatTime(connection.lastSync) }}
      </div>
    </div>
    
    <!-- Connection Details -->
    <div class="connection-card-details">
      <div v-if="connection.config.pollIntervalMinutes" class="connection-card-detail">
        <span class="connection-card-detail-label">Poll Interval:</span>
        <span class="connection-card-detail-value">{{ formatInterval(connection.config.pollIntervalMinutes) }}</span>
      </div>
      
      <div v-if="connection.errorCount > 0" class="connection-card-detail">
        <span class="connection-card-detail-label">Error Count:</span>
        <span class="connection-card-detail-value connection-card-detail-error">{{ connection.errorCount }}</span>
      </div>
    </div>
    
    <!-- Configuration Preview -->
    <div class="connection-card-config">
      <h4 class="connection-card-config-title">Configuration</h4>
      
      <div class="connection-card-config-details">
        <div v-if="connection.config.baseUrl" class="connection-card-config-detail">
          <span class="connection-card-config-label">API URL:</span>
          <span class="connection-card-config-value">{{ connection.config.baseUrl }}</span>
        </div>
        
        <div v-if="connection.config.spreadsheetId" class="connection-card-config-detail">
          <span class="connection-card-config-label">Spreadsheet:</span>
          <span class="connection-card-config-value">{{ connection.config.sheetName || connection.config.spreadsheetId }}</span>
        </div>
        
        <div v-if="connection.config.sapHost" class="connection-card-config-detail">
          <span class="connection-card-config-label">SAP Host:</span>
          <span class="connection-card-config-value">{{ connection.config.sapHost }}</span>
        </div>
        
        <div v-if="connection.config.host" class="connection-card-config-detail">
          <span class="connection-card-config-label">SFTP Host:</span>
          <span class="connection-card-config-value">{{ connection.config.host }}</span>
        </div>
        
        <div v-if="connection.config.databaseName" class="connection-card-config-detail">
          <span class="connection-card-config-label">Database:</span>
          <span class="connection-card-config-value">{{ connection.config.databaseName }}</span>
        </div>
      </div>
    </div>
    
    <!-- Actions -->
    <div class="connection-card-actions">
      <button
        type="button"
        class="connection-card-action-button connection-card-action-test"
        @click="$emit('test-connection', connection.id)"
        :disabled="disabled || testing"
      >
        <span v-if="testing" class="connection-card-action-loading">
          <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Testing...
        </span>
        <span v-else>Test Connection</span>
      </button>
      
      <button
        type="button"
        class="connection-card-action-button connection-card-action-import"
        @click="$emit('run-import', connection.id)"
        :disabled="disabled || connection.status !== 'active' || importing"
      >
        <span v-if="importing" class="connection-card-action-loading">
          <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Importing...
        </span>
        <span v-else>Run Import</span>
      </button>
      
      <button
        type="button"
        class="connection-card-action-button connection-card-action-edit"
        @click="$emit('edit-connection', connection.id)"
        :disabled="disabled"
        aria-label="Edit connection"
      >
        <PencilIcon class="w-4 h-4" />
      </button>
      
      <button
        type="button"
        class="connection-card-action-button connection-card-action-delete"
        @click="confirmDelete"
        :disabled="disabled"
        aria-label="Delete connection"
      >
        <TrashIcon class="w-4 h-4" />
      </button>
    </div>
    
    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteConfirm" class="connection-card-modal-backdrop">
      <div class="connection-card-modal">
        <h4 class="connection-card-modal-title">Delete Connection</h4>
        <p class="connection-card-modal-message">
          Are you sure you want to delete the connection "{{ connection.name }}"? This action cannot be undone.
        </p>
        <div class="connection-card-modal-actions">
          <button
            type="button"
            class="connection-card-modal-button connection-card-modal-button-cancel"
            @click="showDeleteConfirm = false"
          >
            Cancel
          </button>
          <button
            type="button"
            class="connection-card-modal-button connection-card-modal-button-delete"
            @click="deleteConnection"
          >
            Delete
          </button>
        </div>
      </div>
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
  PencilIcon,
  TrashIcon
} from '@heroicons/vue/24/outline';

interface Props {
  connection: ConnectionConfig;
  disabled?: boolean;
  testing?: boolean;
  importing?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  testing: false,
  importing: false
});

const emit = defineEmits<{
  'test-connection': [connectionId: string];
  'run-import': [connectionId: string];
  'edit-connection': [connectionId: string];
  'delete-connection': [connectionId: string];
}>();

// State
const showDeleteConfirm = ref(false);

// Methods
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

const formatInterval = (minutes: number) => {
  if (minutes < 60) {
    return `${minutes} minutes`;
  } else {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 
      ? `${hours} hour${hours > 1 ? 's' : ''} ${remainingMinutes} min`
      : `${hours} hour${hours > 1 ? 's' : ''}`;
  }
};

const confirmDelete = () => {
  showDeleteConfirm.value = true;
};

const deleteConnection = () => {
  showDeleteConfirm.value = false;
  emit('delete-connection', props.connection.id);
};
</script>

<style scoped>
.connection-card {
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  overflow: hidden;
  transition: all 0.2s;
}

.connection-card:hover {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.connection-card-disabled {
  opacity: 0.6;
  pointer-events: none;
}

.connection-card-header {
  display: flex;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.connection-card-icon-container {
  margin-right: 1rem;
}

.connection-card-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.5rem;
}

.connection-card-title-container {
  flex: 1;
}

.connection-card-title {
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.connection-card-subtitle {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0.25rem 0 0;
}

.connection-card-badges {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.connection-card-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.25rem 0.5rem;
  font-size: 0.625rem;
  font-weight: 600;
  border-radius: 9999px;
  white-space: nowrap;
}

.connection-card-status {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  background-color: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
}

.connection-card-status-indicator {
  display: flex;
  align-items: center;
}

.connection-card-status-dot {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 9999px;
  margin-right: 0.5rem;
}

.connection-card-status-text {
  font-size: 0.875rem;
  color: #4b5563;
}

.connection-card-last-sync {
  font-size: 0.75rem;
  color: #6b7280;
}

.connection-card-details {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.connection-card-detail {
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
}

.connection-card-detail:last-child {
  margin-bottom: 0;
}

.connection-card-detail-label {
  color: #6b7280;
}

.connection-card-detail-value {
  font-weight: 500;
  color: #111827;
}

.connection-card-detail-error {
  color: #ef4444;
}

.connection-card-config {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #e5e7eb;
  background-color: #f9fafb;
}

.connection-card-config-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 0.5rem;
}

.connection-card-config-details {
  font-size: 0.75rem;
}

.connection-card-config-detail {
  margin-bottom: 0.25rem;
}

.connection-card-config-label {
  color: #6b7280;
  margin-right: 0.25rem;
}

.connection-card-config-value {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  color: #111827;
  word-break: break-all;
}

.connection-card-actions {
  display: flex;
  padding: 0.75rem 1rem;
  gap: 0.5rem;
}

.connection-card-action-button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s;
}

.connection-card-action-test {
  flex: 1;
  color: #4b5563;
  background-color: #f3f4f6;
  border: 1px solid #d1d5db;
}

.connection-card-action-test:hover:not(:disabled) {
  background-color: #e5e7eb;
}

.connection-card-action-import {
  flex: 1;
  color: white;
  background-color: #3b82f6;
  border: 1px solid #3b82f6;
}

.connection-card-action-import:hover:not(:disabled) {
  background-color: #2563eb;
}

.connection-card-action-edit,
.connection-card-action-delete {
  width: 2.5rem;
  color: #4b5563;
  background-color: #f3f4f6;
  border: 1px solid #d1d5db;
}

.connection-card-action-edit:hover:not(:disabled) {
  color: #3b82f6;
  border-color: #3b82f6;
}

.connection-card-action-delete:hover:not(:disabled) {
  color: #ef4444;
  border-color: #ef4444;
}

.connection-card-action-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.connection-card-action-loading {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.connection-card-modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
}

.connection-card-modal {
  background-color: white;
  border-radius: 0.5rem;
  padding: 1.5rem;
  width: 100%;
  max-width: 28rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.connection-card-modal-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 1rem;
}

.connection-card-modal-message {
  font-size: 0.875rem;
  color: #4b5563;
  margin: 0 0 1.5rem;
}

.connection-card-modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}

.connection-card-modal-button {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s;
}

.connection-card-modal-button-cancel {
  color: #4b5563;
  background-color: #f3f4f6;
  border: 1px solid #d1d5db;
}

.connection-card-modal-button-cancel:hover {
  background-color: #e5e7eb;
}

.connection-card-modal-button-delete {
  color: white;
  background-color: #ef4444;
  border: 1px solid #ef4444;
}

.connection-card-modal-button-delete:hover {
  background-color: #dc2626;
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .connection-card-actions {
    flex-wrap: wrap;
  }
  
  .connection-card-action-test,
  .connection-card-action-import {
    flex-basis: calc(50% - 0.25rem);
  }
  
  .connection-card-action-edit,
  .connection-card-action-delete {
    flex-basis: calc(25% - 0.25rem);
  }
}

/* iOS optimizations */
:global(.ios-device) .connection-card-action-button {
  padding-top: 0.625rem;
  padding-bottom: 0.625rem;
}

/* Android optimizations */
:global(.android-device) .connection-card-action-button {
  font-weight: 400;
}
</style>